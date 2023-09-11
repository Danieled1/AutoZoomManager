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
  const { liveMeetings } = useMeetingContext(); // Use liveMeetings instead of usersMap

  const renderRow = (meeting, index) => {
    // Split the topic into teacher, course, and date
    const [teacher, course, date] = meeting.topic.split(" - ");
    const createdDate = new Date(meeting.created_at).toLocaleString();

    return (
      <Tr key={meeting.id} className="row">
        <Td>{teacher}</Td>
        <Td>{course}</Td>
        <Td>{date}</Td>
        <Td>{meeting.id}</Td>
        <Td>{createdDate}</Td>
        {/* Add a badge when the user has reached the maximum sessions */}
        {meeting.status === "started" && (
          <Td>
            <Badge colorScheme="green" p="1" fontSize="0.8em">
              Meeting Started
            </Badge>
          </Td>
        )}
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
            data={liveMeetings}
            headers={headers}
            renderRow={renderRow}
            tableStyles={modalStyles.table}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default UsersModal;
