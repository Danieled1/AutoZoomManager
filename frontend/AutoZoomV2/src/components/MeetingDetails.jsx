import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import moment from "moment";
import { meeting_styles } from "../styles/Styles";

function MeetingDetails({ meetingDetails }) {
  const { box, stack, heading} = meeting_styles;
  if (!meetingDetails) {
    return null;
  }
  return (
    <Box sx={box}>
      <Stack sx={stack} spacing={4}>
        <Heading sx={heading} fontSize="xl" mb={4}>
          Meeting Details
        </Heading>
        <Text className="labels">
          Teacher - Coures - Date:
        </Text>
        <Text fontSize="md" mb={4}>
          {meetingDetails.topic}
        </Text>
        <Text className="labels">
          Start Time:
        </Text>
        <Text fontSize="md" mb={4}>
          {moment(meetingDetails.start_time).format("HH:mm")}
        </Text>
        <Text className="labels">
          Duration:
        </Text>
        <Text fontSize="md">
          {meetingDetails.duration} Minutes
        </Text>
      </Stack>
    </Box>
  );
}

export default MeetingDetails;
