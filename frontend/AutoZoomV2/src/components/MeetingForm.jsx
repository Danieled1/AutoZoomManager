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
import CreatableSelect from "react-select/creatable";
import AnimatedText from "./Header/AnimatedText";
function MeetingForm() {
  const {
    teacherName,
    setTeacherName,
    courseName,
    setCourseName,
    createMeeting,
  } = useMeetingContext();
  const { box, stack, heading, btn } = meeting_styles;
  const [isLoading, setIsLoading] = useState(false);
  const handleCreateMeeting = async () => {
    setIsLoading(true);
    await createMeeting();
    setIsLoading(false);
  };
  // Styles for selector of courses
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
    { value: "QA", label: "QA" },
    { value: "Data&Digital", label: "Data&Digital" },
    { value: "AI", label: "AI" },
    { value: "Other", label: "(type your own)" },
  ];
  const handleInputChange = (inputValue, actionMeta) => {
    if (actionMeta.action === "create-option" && inputValue !== "Other") {
      setCourseName(`Other: ${inputValue}`);
    }
  };

  return (
    <Box sx={box}>
      <Stack sx={stack} spacing={5}>
        <AnimatedText />
        <Heading sx={heading} as="h2">
          Create Meeting
        </Heading>
        <FormControl>
          <FormLabel>Teacher Name</FormLabel>
          <Input
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            placeholder="Name"
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
          <CreatableSelect
            styles={customStyles}
            options={options}
            value={
              courseName.startsWith("Other:")
                ? { label: courseName, value: courseName }
                : options.find((option) => option.value === courseName)
            }
            onChange={(option) => setCourseName(option.value)}
            onInputChange={handleInputChange}
          />
          <FormHelperText>
            Select the name of the course for this meeting.
          </FormHelperText>
        </FormControl>
        <Tooltip label="Click here to create a new meeting" placement="bottom">
          <Button
            colorScheme="teal"
            onClick={handleCreateMeeting}
            disabled={isLoading}
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
