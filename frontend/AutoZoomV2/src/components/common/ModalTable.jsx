/*
    This is a reusable table component. It accepts three props:
    data: array of table's data.
    headers: array of headers for the table.
    renderRow: function that takes an item of data + its index, and returns a row for the table.
*/

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
} from "@chakra-ui/react";
function ModalTable({
  data,
  headers,
  renderRow,
  tableStyles,
  isLoading,
  size,
}) {
  return (
    <Table sx={tableStyles} size={size}>
      <Thead>
        <Tr>
          {headers.map((header, index) => (
            <Th key={index}>{header}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {isLoading ? (
          <Tr>
            <Td colSpan={headers.length} textAlign="center">
              <Spinner size="xl" />
            </Td>
          </Tr>
        ) : (
          data && data.map(renderRow)
        )}
      </Tbody>
    </Table>
  );
}

export default ModalTable;
