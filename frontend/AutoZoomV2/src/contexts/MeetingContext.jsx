import { useToast, useClipboard } from "@chakra-ui/react";
import axios from "axios";
import moment from "moment";
import { createContext, useCallback, useContext, useState } from "react";
import { DownloadRecordingsModal, UsersModal } from "../components";

const MeetingContext = createContext();

export const MeetingProvider = ({ children, initialUsersMap }) => {
  const [teacherName, setTeacherName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [totalSessionsCount, setTotalSessionsCount] = useState(0);
  const [meetingDetails, setMeetingDetails] = useState({});
  const [isRecordingsModalOpen, setIsRecordingsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();
  const { hasCopied, onCopy } = useClipboard(meetingDetails.join_url || "");
  const [usersMap, setUsersMap] = useState(() => {
    return initialUsersMap.reduce((map, user, index) => {
      const userId = `user${index + 1}`;
      return {
        ...map,
        [userId]: { ...user, sessions: 0, meetingIds: [], currentTeacher: "" },
      };
    }, {});
  });

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

  const validateInputs = () => {
    if (!teacherName || !courseName) {
      return false;
    }
    return true;
  };
  const selectRandomUser = useCallback(() => {
    const users = Object.keys(usersMap);
    const randomIndex = Math.floor(Math.random() * users.length);
    const selectedUserId = users[randomIndex];
    const selectedUser = usersMap[selectedUserId];
    return selectedUser;
  }, [usersMap]);

  const createMeetingRequest = async (selectedUserId) => {
    const response = await axios.post(
      `http://3.80.182.53:8080/api/meetings/${selectedUserId}`,
      {
        topic: `${teacherName} - ${courseName} - ${moment().format(
          "DD/MM/YYYY"
        )}`,
        duration: 420, // Meeting duration in minutes
        settings: {
          password: "",
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
    if (!validateInputs()) {
      displayErrorToast(
        "Data Required.",
        "Please fill in your name and course name."
      );
      return;
    }

    const selectedUser = selectRandomUser();

    if (
      !selectedUser ||
      selectedUser.sessions >= 2 ||
      totalSessionsCount >= 18
    ) {
      displayErrorToast(
        "Session Limit Reached.",
        "You have reached the maximum session limit."
      );
      return;
    }
    try {
      const data = await createMeetingRequest(selectedUser.id);
      updateMeetingDetails(data);
      updateUserSessions(selectedUser.id, data);
      updateTotalSessionsCount();
      displaySuccessToast(
        "Meeting Created.",
        "The meeting has been successfully created."
      );
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
      }}
    >
      {/* Users Occupation Box */}
      <UsersModal usersMap={usersMap} onClose={closeModal} isOpen={isOpen} />

      {/* Download & Delete Recordings Box */}
      <DownloadRecordingsModal
        isRecordingsModalOpen={isRecordingsModalOpen}
        closeRecordingsModal={closeRecordingsModal}
        usersMap={usersMap}
        displayErrorToast={displayErrorToast}
        displaySuccessToast={displaySuccessToast}
        formatBytes={formatBytes}
      />
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeetingContext = () => useContext(MeetingContext);