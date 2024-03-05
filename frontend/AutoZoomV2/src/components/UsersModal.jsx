import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Tr,
  Td,
  Badge,
} from "@chakra-ui/react";
import { modalStyles } from "../styles/Styles";
import ModalTable from "./common/ModalTable";
import { useMeetingContext } from "../contexts/MeetingContext";

function UsersModal({ onClose, isOpen }) {
  const headers = ["Teacher", "Course", "Date", "Meeting ID", "Created At"];

  // const { liveMeetings } = useMeetingContext(); // Use liveMeetings instead of usersMap
  const renderRow = () => {
    return (
      <Tr key="placeholder-row">
      <Td colSpan="5" textAlign="center">
      Live Meetings Feature Will Be Back Soon, currently in development phase.
        {/* For Displaying Rows of data based on Headers. */}
      </Td>
    </Tr>
    );
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent sx={modalStyles.modal_content}>
        <ModalHeader sx={modalStyles.modal_header}>Live Meetings</ModalHeader>
        <ModalCloseButton sx={modalStyles.secondary_color} />
        <ModalBody sx={modalStyles.modal_body}>
          <ModalTable
            data={[false]}
            headers={headers}
            renderRow={renderRow}
            tableStyles={modalStyles.table}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blackAlpha" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default UsersModal;
