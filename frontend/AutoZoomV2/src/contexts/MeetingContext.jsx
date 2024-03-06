import axios from "axios";
import moment from "moment";
import escape from "validator/lib/escape";
import { useToast, useClipboard } from "@chakra-ui/react";
import { DownloadRecordingsModal, UsersModal } from "../components";
import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

const MeetingContext = createContext();
const config = {
  apiBaseUrl: "https://zoom-generator-backend-9b73668fa08e.herokuapp.com",
};
const { apiBaseUrl } = config;
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}
export const MeetingProvider = ({ children, initialUsersMap }) => {
  const shuffledUsers = shuffle([...initialUsersMap]);
  const [areUsersAvailable, setAreUsersAvailable] = useState(true);
  const [lessonName, setLessonName] = useState("")
  const [teacherName, setTeacherName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [totalSessionsCount, setTotalSessionsCount] = useState(0);
  const [meetingDetails, setMeetingDetails] = useState({});
  const [isRecordingsModalOpen, setIsRecordingsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();
  const { hasCopied, onCopy } = useClipboard(meetingDetails.join_url || "");
  const [usersMap, setUsersMap] = useState(() => {
    return shuffledUsers.reduce((map, user, index) => {
      const userId = `user${index + 1}`;
      return {
        ...map,
        [userId]: { ...user, sessions: 0, meetingIds: [], currentTeacher: "" },
      };
    }, {});
  });
  const [breakoutRooms, setBreakoutRooms] = useState([
    { name: "", participants: [""] },
  ]);

  const generateWhatsAppMessage = useCallback(() => {
    const { topic, join_url } = meetingDetails;
    if (topic && join_url) {
      const message = `Join our Zoom meeting for ${topic}. Click the link below to join:\n${join_url}`;
      return message;
    }
    return "";
  }, [meetingDetails]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const openRecordingsModal = () => setIsRecordingsModalOpen(true);
  const closeRecordingsModal = () => setIsRecordingsModalOpen(false);

  const sanitizeInput = (input) => {
    let sanitized = input
      .replace(/<script.*?>.*?<\/script>/g, "")
      .replace(/(['";])/g, "\\$1")
      .trim();
    sanitized = escape(sanitized);
    return sanitized;
  };
  const validateInputs = () => {
  const MAX_INPUT_LENGTH = 255;
  const errors = {
    missingInput: "Both teacher name and course name are required.",
    inputTooLong: `Each input must be less than ${MAX_INPUT_LENGTH} characters long.`,
    emptyInput: "Inputs must not be empty.",
    invalidCharacters: "Inputs contain invalid characters."
  };
    if (!teacherName && !courseName) {
      return errors.missingInput;
    }
    if (teacherName.length > MAX_INPUT_LENGTH || courseName.length > MAX_INPUT_LENGTH) {
      return errors.inputTooLong;
    }
    if (!teacherName.trim() || !courseName.trim()) {
      return errors.emptyInput;
    }
    const whitelistPattern = /^[a-zA-Z0-9 _.,!:"'&/$()\u0590-\u05FF]+$/;
      // Function to find invalid characters
  const findInvalidCharacters = (input) => {
    return [...input].filter(character => !whitelistPattern.test(character));
  };

  // Check teacherName for invalid characters
  const invalidTeacherChars = findInvalidCharacters(teacherName);
  if (invalidTeacherChars.length > 0) {
    console.log('Validation Error: invalidCharacters in teacherName');
    console.log('Invalid characters:', invalidTeacherChars.join(' '));
    return errors.invalidCharacters;
  }

  // Check courseName for invalid characters
  const invalidCourseChars = findInvalidCharacters(courseName);
  if (invalidCourseChars.length > 0) {
    console.log('Validation Error: invalidCharacters in courseName');
    console.log('Invalid characters:', invalidCourseChars.join(' '));
    return errors.invalidCharacters;
  }
    return true;
  };

  const selectRandomUser = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/zoom-users/eligible`);
      const eligibleUsers = response.data.eligibleZoomUsers;
      if (!eligibleUsers || eligibleUsers.length === 0) {
        displayErrorToast(
          "No Eligible Users.",
          "There are no eligible users left to create a meeting."
        );
        setAreUsersAvailable(false);
        return null;
      }

      const randomIndex = Math.floor(Math.random() * eligibleUsers.length);
      const selectedUser = eligibleUsers[randomIndex];
      const selectedUserId = selectedUser.zoomAccountId;

      return { selectedUser, selectedUserId };
    } catch (err) {
      displayErrorToast(
        "Failed to Create Meeting.",
        "An error occurred while creating the meeting."
      );
      return null;
    }
  }, []);

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

  const updateMeetingDetails = useCallback(
    (data) => {
      setMeetingDetails(data);
    },
    [meetingDetails]
  );

  const updateUserSessions = (selectedUserId, data) => {
    setUsersMap((prevUsersMap) => {
      const prevUser = prevUsersMap[selectedUserId];
      if (!prevUser) {
        return prevUsersMap;
      }
      return {
        ...prevUsersMap,
        [selectedUserId]: {
          ...prevUser,
          sessions: prevUser.sessions + 1,
          meetingIds: [...prevUser.meetingIds, data.id],
          currentTeacher: [...prevUser.currentTeacher, teacherName],
        },
      };
    });
  };

  const updateTotalSessionsCount = () => {
    setTotalSessionsCount((prevCount) => prevCount + 1);
  };

  const displaySuccessToast = (title, description, status) => {
    toast({
      title: title || "Meeting Created.",
      description: description || "The meeting has been successfully created.",
      status: status || "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const displayErrorToast = (title, description) => {
    toast({
      title: title || "Failed to Create Meeting.",
      description:
        description || "An error occurred while creating the meeting.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const createMeeting = async () => {
    const validationMessage = validateInputs();
    if (validationMessage !== true) {
      displayErrorToast("Validation Failed", validationMessage);
      return;
    }

    const { selectedUser, selectedUserId } = await selectRandomUser();
    if (!selectedUser) {
      displayErrorToast(
        "No Eligible Users.",
        "All users have reached the maximum session limit."
      );
      return;
    }
    try {
      const data = await createMeetingRequest(selectedUser.zoomAccountId);
      updateMeetingDetails(data);
      updateUserSessions(selectedUserId, data);
      updateTotalSessionsCount();
      displaySuccessToast(
        "Meeting Created.",
        "The meeting has been successfully created."
      );
      window.open(data.start_url, "_blank");
    } catch (err) {
      displayErrorToast(
        "Failed to Create Meeting.",
        "An error occurred while creating the meeting."
      );
      console.error(err.message);
      return;
    }
  };
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
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
        setUsersMap,
        meetingDetails,
        updateMeetingDetails,
        createMeeting,
        openModal,
        closeModal,
        openRecordingsModal,
        closeRecordingsModal,
        hasCopied,
        onCopy,
        generateWhatsAppMessage,
        displaySuccessToast,
        displayErrorToast,
        formatBytes,
        apiBaseUrl,
        areUsersAvailable,
        breakoutRooms,
        setBreakoutRooms,
      }}
    >
      {/* Users Occupation Box */}
      <UsersModal onClose={closeModal} isOpen={isOpen} />

      {/* Download & Delete Recordings Box */}
      <DownloadRecordingsModal
        isRecordingsModalOpen={isRecordingsModalOpen}
        closeRecordingsModal={closeRecordingsModal}
        usersMap={usersMap}
        displayErrorToast={displayErrorToast}
        displaySuccessToast={displaySuccessToast}
        formatBytes={formatBytes}
        apiBaseUrl={apiBaseUrl}
      />
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeetingContext = () => useContext(MeetingContext);
