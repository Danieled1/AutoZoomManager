import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Input,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  ButtonGroup,
  Tooltip,
  Spinner,
} from "@chakra-ui/react";
import { DeleteIcon, DownloadIcon } from "@chakra-ui/icons";
import axios from "axios";
import { format, isValid } from "date-fns";
import { modal_styles } from "../styles/Styles";
import ReusableTableComponent from "./common/TableComponent";
import ButtonGroups from "./common/ButtonGroups";

const DownloadRecordingsModal = ({
  isRecordingsModalOpen,
  closeRecordingsModal,
  usersMap,
  displaySuccessToast,
  displayErrorToast,
  formatBytes,
}) => {
  const [date, setDate] = useState("");
  const [recordings, setRecordings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadsInitiated, setDownloadsInitiated] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const { modal_content, modal_header, modal_body, secondary_color, table } =
    modal_styles;

  const fetchRecordings = async () => {
    try {
      setIsLoading(true);
      const promises = Object.values(usersMap).map(async (user) => {
        const response = await axios.get(
          `http://3.80.182.53:8080/api/users/${user.id}/recordings`,
          {
            params: {
              from: date,
              to: date,
            },
          }
        );

        const { data } = response;

        const userRecordings = data.meetings.flatMap((meeting) => {
          const start_time = new Date(meeting.start_time);
          // If start_time is not a valid date, skip this iteration
          if (!isValid(start_time)) return [];

          return meeting.recording_files.flatMap((recording, index) => {
            // Skip this iteration if file_type is "CHAT"
            if (recording.file_type === "CHAT") return [];

            return {
              topic: `${meeting.topic}_${index + 1}`,
              start_time: format(start_time, "PPP p"),
              download_url: recording.download_url,
              meetingId: meeting.id,
              recordingId: recording.id,
              file_size: recording.file_size,
            };
          });
        });

        return {
          user: user.name,
          recordings: userRecordings,
        };
      });

      const results = await Promise.all(promises);
      const resultsWithRecordings = results.filter(
        (result) => result.recordings.length > 0
      );
      console.log(resultsWithRecordings, "All the recordings");
      setRecordings(resultsWithRecordings);
      setSearchPerformed(true);
      setIsLoading(false);
      displaySuccessToast(
        `Recordings Fetched.`,
        `The recordings of ${date} has been successfully fetched`,
        `info`
      );
    } catch (error) {
      console.error("Error fetching recordings:", error);
      displayErrorToast(
        `Failed to Fetch Recordings`,
        `An error occurred while fetching the meeting.\n Error:${error}`
      );
    }
  };
  const downloadAllRecordings = (selectedRecording) => {
    try {
      if (selectedRecording) {
        window.open(selectedRecording.download_url, "_blank");
      } else {
        recordings.forEach((result) => {
          result.recordings.forEach((recording) => {
            window.open(recording.download_url, "_blank");
            setDownloadsInitiated(true);
          });
        });
      }
      displaySuccessToast(
        `Downloading Started.`,
        `It will take some time based on the file size`,
        `info`
      );
    } catch (err) {
      console.error("Error downloading recordings:", err);
      displayErrorToast(
        `Failed to Download Recordings`,
        `An error occurred while downloading the recording.\n Error:${err}\n`
      );
    }
  };
  // NEED TO FINISH DELETE ALL FEATURE
  const deleteMeetingRecordings = async (meetingId, action, recordingId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/meetings/${meetingId}/recordings`,
        {
          params: { action },
        }
      );
      if (response.status === 200) {
        setRecordings((prevRecordings) =>
          prevRecordings.map((userRecordings) => {
            if (
              userRecordings.recordings.some(
                (recording) => recording.recordingId === recordingId
              )
            ) {
              return {
                ...userRecordings,
                recordings: userRecordings.recordings.filter(
                  (recording) => recording.recordingId !== recordingId
                ),
              };
            } else {
              return userRecordings;
            }
          })
        );
        displaySuccessToast(
          `Delete recording.`,
          `Successfully deleted the recording`,
          `info`
        );
      }
    } catch (err) {
      console.error("Error deleting recordings:", err);
      displayErrorToast(
        `Failed to Delete Recording`,
        `An error occurred while deleting the recording.\n Error:${err}\n`
      );
    }
  };
  const deleteAllRecordings = async (action) => {
    try {
      let deletedRecordings = [];
      for (let userRecordings of recordings) {
        for (let recording of userRecordings.recordings) {
          const response = await axios.delete(
            `http://localhost:8080/api/meetings/${recording.meetingId}/recordings`,
            {
              params: { action, recordingId: recording.recordingId },
            }
          );
          if (response.status === 200) {
            deletedRecordings.push(recording.recordingId);
          }
        }
      }
      setRecordings((prevRecordings) =>
        prevRecordings.map((userRecordings) => ({
          ...userRecordings,
          recordings: userRecordings.recordings.filter(
            (recording) => !deletedRecordings.includes(recording.recordingId)
          ),
        }))
      );
      if (
        deletedRecordings.length ===
        recordings.flatMap((r) => r.recordings).length
      ) {
        displaySuccessToast(
          `Delete recording.`,
          `Successfully deleted the recording`,
          `info`
        );
      } else {
        throw new Error("Not all recordings were deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting recordings:", err);
      displayErrorToast(
        `Failed to Delete Recording`,
        `An error occurred while deleting the recording.\n Error:${err}\n`
      );
    }
  };
  const handleDateChange = (event) => setDate(event.target.value);

  const handleDownloadAll = () => downloadAllRecordings();
  const handleDeleteAll = () => deleteAllRecordings("trash");
  const handleDownload = (recording) => {
    console.log(recording);
    downloadAllRecordings(recording);
  };
  const handleDelete = (recording) =>
    deleteMeetingRecordings(
      recording.meetingId,
      "trash",
      recording.recordingId
    );

  const headers = ["User", "Topic", "Date", "File Size", "Actions"]; // Add or remove headers as per the data
  // ======= ERRORR ON BUTTON GROUPS OF DOWNLOAD AND DELETE !!!! =========

  // ================================================================================================
  const renderRow = (result, index) =>
    result.recordings.map((recording, recordingIndex) => (
      <Tr key={`${index}-${recordingIndex}`} className="row">
        <Td>{result.user}</Td>
        <Td className="truncate">{recording.topic}</Td>
        <Td className="truncate">{recording.start_time}</Td>
        <Td>{formatBytes(recording.file_size)}</Td>
        <Td>
          <ButtonGroups
            onDownload={() => handleDownload(recording)}
            onDelete={() => handleDelete(recording)}
            isRowSpecific={true}
            recording={recording}
          />
        </Td>
      </Tr>
    ));
  return (
    <Modal
      isOpen={isRecordingsModalOpen}
      onClose={closeRecordingsModal}
      size="6xl"
    >
      <ModalOverlay />
      <ModalContent sx={modal_content}>
        <ModalHeader sx={modal_header}>Recordings Manager</ModalHeader>
        <ModalCloseButton sx={secondary_color} />
        <ModalBody sx={modal_body}>
          <Input type="date" onChange={handleDateChange} autoFocus />
          <ButtonGroups
            onFetch={fetchRecordings}
            onDownloadAll={handleDownloadAll}
            onDeleteAll={handleDeleteAll}
            searchPerformed={searchPerformed}
            downloadsInitiated={downloadsInitiated}
            areRecordingsAvailable={recordings.length > 0}
          />
          <ReusableTableComponent
            data={recordings}
            headers={headers}
            renderRow={renderRow}
            tableStyles={table}
            isLoading={isLoading}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={closeRecordingsModal}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DownloadRecordingsModal;
