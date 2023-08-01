import React, { useEffect } from "react";
import { Tr, Td, Box, Stack, Heading } from "@chakra-ui/react";
import moment from "moment";
import { meeting_styles, modal_styles } from "../styles/Styles";
import ModalTable from "./common/ModalTable";

function MeetingDetails({ meetingDetails }) {
  if (!meetingDetails) {
    return null;
  }
  const { box, stack, heading } = meeting_styles;
  const [name, course, date] = meetingDetails.topic.split(" - ");

  const headers = ["Teacher", "Course", "Start Time", "Duration", "Date"];
  const data = [
    {
      Teacher: name,
      Course: course,
      "Start Time": moment(meetingDetails.start_time).format("HH:mm"),
      Duration: `${meetingDetails.duration} Min`,
      Date: date,
    },
  ];
  const renderRow = (item, index) => (
    <Tr key={index} className="row">
      <Td>{item.Teacher}</Td>
      <Td>{item.Course}</Td>
      <Td>{item["Start Time"]}</Td>
      <Td>{item.Duration}</Td>
      <Td>{item.Date}</Td>
    </Tr>
  );
  return (
    <Box sx={box}>
      <Stack sx={stack} spacing={4}>
        <Heading sx={heading} fontSize="xl" mb={4}>
          Meeting Details
        </Heading>
        <ModalTable
          data={data}
          headers={headers}
          renderRow={renderRow}
          tableStyles={modal_styles.table}
          size={"sm"}
          
        />
      </Stack>
    </Box>
  );
}

export default MeetingDetails;
