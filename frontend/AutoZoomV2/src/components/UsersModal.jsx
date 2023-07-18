import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from "@chakra-ui/react";
import { modal_styles } from "../styles/Styles";
import ReusableTableComponent from "./common/TableComponent";

function UsersModal({ usersMap, onClose, isOpen }) {
  const headers = ["Teacher", "Name", "Session Count", "Meeting IDs", "ID"];

  const renderRow = (user, index) => (
    <Tr key={user.id} className="row">
      <Td>{user.currentTeacher}</Td>
      <Td>{user.name}</Td>
      <Td>{user.sessions}</Td>
      <Td>{user.meetingIds.join(", ")}</Td>
      <Td>{user.id}</Td>
      {/* Add a badge when the user has reached the maximum sessions */}
      {user.sessions >= 2 && (
        <Td>
          <Badge colorScheme="red" p="1" fontSize="0.8em">
            Max sessions reached
          </Badge>
        </Td>
      )}
    </Tr>
  );
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent sx={modal_styles.modal_content}>
        <ModalHeader sx={modal_styles.modal_header}>
          Users Occupation
        </ModalHeader>
        <ModalCloseButton sx={modal_styles.secondary_color} />
        <ModalBody sx={modal_styles.modal_body}>
          <ReusableTableComponent
            data={Object.values(usersMap)}
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
