import { useState } from "react";
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
  Tr,
  Td,
} from "@chakra-ui/react";
import { meeting_styles, modalStyles } from "../styles/Styles";
// Change 1
// import ButtonGroups from "./common/ButtonGroups";
// import CommonRecordingsHandler from "./common/commonRecordingsHandler";
// import ModalTable from "./common/ModalTable";
import { ButtonGroups, CommonRecordingsHandler, ModalTable } from "./common";

const DownloadRecordingsModal = ({
  isRecordingsModalOpen,
  closeRecordingsModal,
  usersMap,
  displaySuccessToast,
  displayErrorToast,
  formatBytes,
  apiBaseUrl,
}) => {

  const [date, setDate] = useState("");
  const [recordings, setRecordings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadsInitiated, setDownloadsInitiated] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const { modal_content, modal_header, modal_body, secondary_color, table, input } = modalStyles;


  const fetchRecordings = async () => {
    CommonRecordingsHandler.fetchRecordings(
      apiBaseUrl,
      usersMap,
      date,
      setRecordings,
      displaySuccessToast,
      displayErrorToast,
      setIsLoading,
      setSearchPerformed
    );
  };
  const downloadSingle = (selectedRecording) => {

    CommonRecordingsHandler.downloadSingleRecordingFromServer(
      displaySuccessToast,
      displayErrorToast,
      selectedRecording,
      apiBaseUrl,
    );
  };
  const downloadAllRecordings = () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to DOWNLOAD all recordings in this list?"
    );
  
    if (userConfirmed) {
      CommonRecordingsHandler.downloadAllRecordingsFromServer(
        recordings,
        displaySuccessToast,
        displayErrorToast,
        apiBaseUrl
      );
    } else {
      console.log("User canceled the action.");
    }
  };
  
  const deleteSingle = async (meetingId, action, recordingId) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to DELETE this recording from the cloud?"
    );
    if (userConfirmed) {
      CommonRecordingsHandler.deleteSingle(
        apiBaseUrl,
        action,
        meetingId,
        recordings,
        recordingId,
        setRecordings,
        displaySuccessToast,
        displayErrorToast
      );
    } else {
      console.log("User canceled the action.");
    }
  };
  const deleteAllRecordings = async (action) => {
    CommonRecordingsHandler.deleteAllRecordings(
      apiBaseUrl,
      recordings,
      setRecordings,
      displaySuccessToast,
      displayErrorToast,
      action
    );
  };

  const handleDateChange = (event) => setDate(event.target.value);
  const handleDownloadAll = () => downloadAllRecordings();
  const handleDeleteAll = () => deleteAllRecordings("trash");
  const handleDownload = (recording) => downloadSingle(recording);
  const handleDelete = (recording) => deleteSingle(recording.meetingId, "trash", recording.recordingId);

  const headers = ["Actions", "Date", "File Size", "Topic", "User"];
  const handleStartTime = (start_time) => {
    return start_time.replace(/\//g, ".");
  };
  const renderRow = (result, index) =>
    result.recordings.map((recording, recordingIndex) => (
      <Tr key={`${index}-${recordingIndex}`} className="row">
        <Td>
          <ButtonGroups
            onDownload={() => handleDownload(recording)}
            onDelete={() => handleDelete(recording)}
            isRowSpecific={true}
            recording={recording}
          />
        </Td>
        <Td className="truncate">{recording.start_time}</Td>
        <Td>{formatBytes(recording.file_size)}</Td>
        <Td className="truncate">{handleStartTime(recording.topic)}</Td>

        <Td>{result.user}</Td>
      </Tr>
    ));
  return (
    <Modal isOpen={isRecordingsModalOpen} onClose={closeRecordingsModal} size="5xl">
      <ModalOverlay />
      <ModalContent sx={modal_content}>
        <ModalHeader sx={modal_header}>Recordings Manager</ModalHeader>
        <ModalCloseButton sx={secondary_color} />
        <ModalBody sx={modal_body}>
          <Input
            type="date"
            onChange={handleDateChange}
            autoFocus
            _focus={{
              outline: "none !important",
              boxShadow: "0 0 1px 2px RGBA(0, 0, 0, 0.32) !important",
              borderColor: "RGBA(0, 0, 0, 0.32) !important",
            }}
          />
          <ButtonGroups
            onFetch={fetchRecordings}
            onDownloadAll={handleDownloadAll}
            onDeleteAll={handleDeleteAll}
            searchPerformed={searchPerformed}
            downloadsInitiated={downloadsInitiated}
            areRecordingsAvailable={recordings.length > 0}
          />
          <ModalTable
            data={recordings}
            headers={headers}
            renderRow={renderRow}
            tableStyles={table}
            isLoading={isLoading}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blackAlpha" onClick={closeRecordingsModal}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DownloadRecordingsModal;
