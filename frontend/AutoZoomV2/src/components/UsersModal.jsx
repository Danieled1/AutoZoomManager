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
import { modal_styles } from "../styles/Styles";
import ModalTable from "./common/ModalTable";
import { useMeetingContext } from "../contexts/MeetingContext";

function UsersModal({ onClose, isOpen }) {
  const headers = [
    "Teacher",
    "Name",
    "Session Count",
    "Meeting IDs",
    "Created At",
  ];
  const { liveMeetings } = useMeetingContext(); // Use liveMeetings instead of usersMap

  const renderRow = (meeting, index) => (
    <Tr key={meeting.id} className="row">
      <Td>{meeting.topic}</Td>
      <Td>{meeting.host_id}</Td>
      <Td>{meeting.duration}</Td>
      <Td>{meeting.id}</Td>
      <Td>{meeting.created_at}</Td>
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
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent sx={modal_styles.modal_content}>
        <ModalHeader sx={modal_styles.modal_header}>Live Meetings</ModalHeader>
        <ModalCloseButton sx={modal_styles.secondary_color} />
        <ModalBody sx={modal_styles.modal_body}>
          <ModalTable
            data={liveMeetings}
            headers={headers}
            renderRow={renderRow}
            tableStyles={modal_styles.table}
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
