import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Heading,
  FormHelperText,
  Button,
  Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";
import { useMeetingContext } from "../contexts/MeetingContext";
import { meeting_styles } from "../styles/Styles";

function MeetingForm() {
  const {
    teacherName,
    setTeacherName,
    courseName,
    setCourseName,
    totalSessionsCount,
    createMeeting,
  } = useMeetingContext();
  const { box, stack, heading } = meeting_styles;
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateMeeting = async () => {
    setIsLoading(true);
    await createMeeting();
    setIsLoading(false);
  };

  return (
    <>
      <Box sx={box}>
        <Stack sx={stack}>
          <FormControl>
            <Heading sx={heading}>Create Meeting</Heading>
            <FormLabel>Your Name</FormLabel>
            <Input
              placeholder='Your Name'
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              autoFocus
            />
            <FormHelperText>Enter your full name.</FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Course Name</FormLabel>
            <Input
              placeholder='Course Name'
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
            <FormHelperText>
              Enter the name of the course for this meeting.
            </FormHelperText>
          </FormControl>
          <Tooltip label='Click here to create a new meeting' placement='bottom'>
            <Button
              colorScheme='teal'
              onClick={handleCreateMeeting}
              disabled={isLoading || totalSessionsCount >= 20}
              isLoading={isLoading}
            >
              Create Meeting
            </Button>
          </Tooltip>
        </Stack>
      </Box>
    </>
  );
}

export default MeetingForm;
