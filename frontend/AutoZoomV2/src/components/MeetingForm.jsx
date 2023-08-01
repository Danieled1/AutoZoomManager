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
import Select from "react-select";
function MeetingForm() {
  const {
    teacherName,
    setTeacherName,
    courseName,
    setCourseName,
    totalSessionsCount,
    createMeeting,
  } = useMeetingContext();
  const { box, stack, heading, btn_box, btn } = meeting_styles;
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateMeeting = async () => {
    setIsLoading(true);
    await createMeeting();
    setIsLoading(false);
  };
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "white" : "black",
      backgroundColor: state.isSelected
        ? "teal"
        : state.isFocused
        ? "#b2dfdb"
        : "white",
      transition: "0.3s ease",
    }),
    control: (provided) => ({
      ...provided,
      borderColor: "teal",
      boxShadow: "none",
      "&:hover": {
        borderColor: "teal",
      },
    }),
  };

  const options = [
    { value: "Full Stack", label: "Full Stack" },
    { value: "Cyber", label: "Cyber" },
    { value: "Qa", label: "Qa" },
    { value: "Data&Digital", label: "Data&Digital" },
    { value: "AI", label: "AI" },
  ];
  return (
    <Box sx={box}>
      <Stack sx={stack} spacing={5}>
        <Heading sx={heading} as="h2">
          Create Meeting
        </Heading>
        <FormControl>
          <FormLabel>Your Name</FormLabel>
          <Input
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            placeholder="Your Name"
            borderColor="teal"
            _hover={{
              borderColor: "teal",
            }}
            _focus={{
              borderColor: "teal",
              boxShadow: "0 0 0 1px teal",
            }}
          />
          <FormHelperText>Enter your full name.</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Course Name</FormLabel>
          <Select
            styles={customStyles}
            options={options}
            value={options.find((option) => option.value === courseName)}
            onChange={(option) => setCourseName(option.value)}
          />
          <FormHelperText>
            Select the name of the course for this meeting.
          </FormHelperText>
        </FormControl>
        <Tooltip label="Click here to create a new meeting" placement="bottom">
          <Button
            colorScheme="teal"
            onClick={handleCreateMeeting}
            disabled={isLoading || totalSessionsCount >= 20}
            isLoading={isLoading}
            sx={btn}
          >
            Create Meeting
          </Button>
        </Tooltip>
      </Stack>
    </Box>
  );
}

export default MeetingForm;
