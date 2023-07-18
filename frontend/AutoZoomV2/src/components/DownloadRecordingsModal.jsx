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
import { modal_styles } from "../styles/Styles";
import ReusableTableComponent from "./common/TableComponent";
import ButtonGroups from "./common/ButtonGroups";
import CommonRecordingsHandler from "./common/commonRecordingsHandler";

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
  const { modal_content, modal_header, modal_body, secondary_color, table } =
    modal_styles;

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

  const downloadAllRecordings = (selectedRecording) => {
    CommonRecordingsHandler.downloadAllRecordings(
      recordings,
      selectedRecording,
      setDownloadsInitiated,
      displaySuccessToast,
      displayErrorToast
    );
  };

  const deleteMeetingRecordings = async (meetingId, action, recordingId) => {
    CommonRecordingsHandler.deleteMeetingRecordings(
      apiBaseUrl,
      action,
      meetingId,
      recordings,
      recordingId,
      setRecordings,
      displaySuccessToast,
      displayErrorToast
    );
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
  const handleDownload = (recording) => downloadAllRecordings(recording);
  const handleDelete = (recording) =>
    deleteMeetingRecordings(
      recording.meetingId,
      "trash",
      recording.recordingId
    );

  const headers = ["User", "Topic", "Date", "File Size", "Actions"];

  const renderRow = (result, index) =>
    result.recordings.map((recording, recordingIndex) => (
      <Tr key={`${index}-${recordingIndex}`} className='row'>
        <Td>{result.user}</Td>
        <Td className='truncate'>{recording.topic}</Td>
        <Td className='truncate'>{recording.start_time}</Td>
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
      size='6xl'
    >
      <ModalOverlay />
      <ModalContent sx={modal_content}>
        <ModalHeader sx={modal_header}>Recordings Manager</ModalHeader>
        <ModalCloseButton sx={secondary_color} />
        <ModalBody sx={modal_body}>
          <Input type='date' onChange={handleDateChange} autoFocus />
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
          <Button colorScheme='teal' onClick={closeRecordingsModal}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DownloadRecordingsModal;
