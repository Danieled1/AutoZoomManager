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
  Text,
  Divider,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { useMeetingContext } from "../contexts/MeetingContext";
import { meeting_styles } from "../styles/Styles";
import CreatableSelect from "react-select/creatable";
import { WhatsappIcon, WhatsappShareButton } from "react-share";
function MeetingForm() {
  const {
    teacherName,
    setTeacherName,
    courseName,
    setCourseName,
    totalSessionsCount,
    createMeeting,
    areUsersAvailable,
  } = useMeetingContext();
  const { box, stack, heading, btn_box, btn } = meeting_styles;
  const [isLoading, setIsLoading] = useState(false);
  const [optionValue, setOptionValue] = useState("");
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
    { value: "Other", label: "Other (type your own)" },
  ];
  const handleInputChange = (inputValue, actionMeta) => {
    if (actionMeta.action === "create-option" && inputValue !== "Other") {
      setCourseName(`Other: ${inputValue}`);
    }
  };
  // Function to generate a message for support
  const generateSupportMessage = () => {
    return "I need help with my meeting.";
  };

  // Your support number (replace with the actual number)
  const supportNumber = "0534824431";
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
        {/* <Tooltip
          label="Click here to contact support via WhatsApp"
          placement="bottom"
        >
          <Box sx={btn_box}>
            <WhatsappShareButton
              url={`https://wa.me/${supportNumber}`}
              title={generateSupportMessage()}
              sx={btn}
            >
              <IconButton
                as="a"
                colorScheme="teal"
                variant="outline"
                aria-label="Contact Support on WhatsApp"
                sx={{
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <WhatsappIcon size={32} round={true} />
              </IconButton>
            </WhatsappShareButton>
          </Box>
        </Tooltip> */}
      </Stack>
    </Box>
  );
}

export default MeetingForm;
