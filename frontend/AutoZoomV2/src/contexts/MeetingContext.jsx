import axios from "axios";
import moment from "moment";
import { useValidation } from "../hooks/useValidation";
import { useFetchUsers } from "../hooks/useFetchUsers";
import { useClipboard } from "@chakra-ui/react";
import { createContext, useCallback, useContext, useState } from "react";
import { formatBytes } from "../utils/utils";
import { useCustomToast } from "../utils/toastTypes";

const MeetingContext = createContext();
const config = {
  apiBaseUrl: "https://zoom-generator-backend-9b73668fa08e.herokuapp.com",
};
const { apiBaseUrl } = config;

export const MeetingProvider = ({ children }) => {
  const [lessonName, setLessonName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [meetingDetails, setMeetingDetails] = useState({});
  const [totalSessionsCount, setTotalSessionsCount] = useState(0);
  const { hasCopied, onCopy } = useClipboard(meetingDetails.join_url || "");
  const [breakoutRooms, setBreakoutRooms] = useState([
    { name: "", participants: [""] },
  ]);
  const { validateInputs } = useValidation();
  const { usersMap, areUsersAvailable } = useFetchUsers(apiBaseUrl);
  const { successToast, errorToast } = useCustomToast();

  const generateWhatsAppMessage = useCallback(() => {
    const { topic, join_url } = meetingDetails;
    if (topic && join_url) {
      const message = `Join our Zoom meeting for ${topic}. Click the link below to join:\n${join_url}`;
      return message;
    }
    return "";
  }, [meetingDetails]);

  const selectRandomUser = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/zoom-users/eligible`);
      const eligibleUsers = response.data.eligibleZoomUsers;
      if (!eligibleUsers || eligibleUsers.length === 0) {
        errorToast(
          "No Eligible Users.",
          "There are no eligible users left to create a meeting."
        );
        return null;
      }

      const randomIndex = Math.floor(Math.random() * eligibleUsers.length);
      const selectedUser = eligibleUsers[randomIndex];
      const selectedUserId = selectedUser.zoomAccountId;
      return { selectedUser, selectedUserId };
    } catch (err) {
      errorToast(
        "Failed to Create Meeting.",
        "An error occurred while creating the meeting."
      );
      return null;
    }
  }, []);
  const updateMeetingDetails = useCallback(
    (data) => {
      setMeetingDetails(data);
    },
    [meetingDetails]
  );
  const createMeetingRequest = async (selectedUserId) => {
    const dateOfLesson = moment().format("DD/MM/YYYY");
    const topic = `${dateOfLesson}-${courseName}-${lessonName}-${teacherName}-1(a)-00.00.00`;
    const response = await axios.post(
      `${apiBaseUrl}/api/meetings/${selectedUserId}`,
      {
        topic,
        duration: 420, // Meeting duration in minutes
        settings: {
          password: "",
          breakout_room: {
            enable: true,
            rooms: breakoutRooms,
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  };

  const createMeeting = async () => {
    const validationMessage = validateInputs(teacherName, courseName);
    if (validationMessage !== true) {
      errorToast("Validation Failed", validationMessage);
      return;
    }

    const { selectedUser, selectedUserId } = await selectRandomUser();
    if (!selectedUser) {
      errorToast(
        "No Eligible Users.",
        "All users have reached the maximum session limit."
      );
      return;
    }
    try {
      const data = await createMeetingRequest(selectedUser.zoomAccountId);
      updateMeetingDetails(data);
      successToast(
        "Meeting Created.",
        "The meeting has been successfully created."
      );
      window.open(data.start_url, "_blank");
    } catch (err) {
      errorToast(`Failed to create the meeting.`, `${err.message}`);
      console.error(err.message);
      return;
    }
  };
  return (
    <MeetingContext.Provider
      value={{
        teacherName,
        setTeacherName,
        courseName,
        setCourseName,
        lessonName,
        setLessonName,
        totalSessionsCount,
        setTotalSessionsCount,
        usersMap,
        meetingDetails,
        updateMeetingDetails,
        createMeeting,
        hasCopied,
        onCopy,
        generateWhatsAppMessage,
        errorToast,
        successToast,
        formatBytes,
        apiBaseUrl,
        areUsersAvailable,
        breakoutRooms,
        setBreakoutRooms,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeetingContext = () => useContext(MeetingContext);
