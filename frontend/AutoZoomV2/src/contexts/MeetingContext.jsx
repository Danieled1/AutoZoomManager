import { useToast, useClipboard } from "@chakra-ui/react";
import axios from "axios";
import moment from "moment";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DownloadRecordingsModal, UsersModal } from "../components";

const MeetingContext = createContext();
const apiBaseUrl = process.env.API_BASE_URL;
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

  const [teacherName, setTeacherName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [totalSessionsCount, setTotalSessionsCount] = useState(0);
  const [meetingDetails, setMeetingDetails] = useState({});
  const [isRecordingsModalOpen, setIsRecordingsModalOpen] = useState(false);
  const [liveMeetings, setLiveMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
  const getUserLiveMeetings = async (userId) => {
    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const fromDate = today.toISOString().split("T")[0];
      const toDate = tomorrow.toISOString().split("T")[0];

      const response = await axios.get(
        `${apiBaseUrl}/api/users/${userId}/meetings?type=live&from=${fromDate}&to=${toDate}`
      );
      return response.data.meetings || [];
    } catch (err) {
      console.error(err.message);
      return [];
    }
  };
  // Fetch live meetings when the component mounts
  const fetchLiveMeetings = async () => {
    setIsLoading(true);
    try {
      const userIds = Object.values(usersMap).map((user) => user.id);
      const meetingsPromises = userIds.map((userId) =>
        getUserLiveMeetings(userId)
      );
      const meetingsData = await Promise.all(meetingsPromises);
      // Flatten the array of meetings data
      const allMeetings = [].concat(...meetingsData);
      // Get today's date at the start of the day
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // Filter the meetings to include only those scheduled for today
      const liveMeetings = allMeetings.filter((meeting) => {
        const meetingDate = new Date(meeting.start_time);
        meetingDate.setHours(0, 0, 0, 0);
        return +meetingDate === +today; // Use unary plus operator to compare dates by their numeric value
      });
      setLiveMeetings(liveMeetings);
    } catch (err) {
      console.error(err.message);
      setLiveMeetings([]);
    }
    setIsLoading(false);
  };
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

  // BUG = NOT PICKING USERS CORRECTLY ============================================================================
  const selectRandomUser = useCallback(async () => {
    try {
      // Fetch eligible users from the server
      const response = await axios.get(`${apiBaseUrl}/api/zoom-users/eligible`);
      const eligibleUsers = response.data.eligibleZoomUsers;
      if (!eligibleUsers || eligibleUsers.length === 0) {
        displayErrorToast(
          "No Eligible Users.",
          "There are no eligible users left to create a meeting."
        );
        setAreUsersAvailable(false); // Update the state to reflect no users are available
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
    const response = await axios.post(
      `${apiBaseUrl}/api/meetings/${selectedUserId}`,
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
  // Follow the usersMap object through the usage
  // useEffect(() => {
  //   console.log(usersMap, "usersmap - useEffect");
  // }, [usersMap]);
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
        apiBaseUrl,
        fetchLiveMeetings,
        liveMeetings,
        areUsersAvailable,
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
