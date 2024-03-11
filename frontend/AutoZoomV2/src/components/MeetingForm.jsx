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
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import { useMeetingContext } from "../contexts/MeetingContext";
import { meeting_styles } from "../styles/Styles";
import CreatableSelect from "react-select/creatable";
import AnimatedText from "./Header/AnimatedText";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
  InfoIcon,
  SmallAddIcon,
} from "@chakra-ui/icons";
function MeetingForm() {
  const {
    teacherName,
    setTeacherName,
    courseName,
    setCourseName,
    lessonName,
    setLessonName,
    createMeeting,
    breakoutRooms,
    setBreakoutRooms,
  } = useMeetingContext();
  const { box, stack, heading, btn, btn_box, input } = meeting_styles;
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

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
        ? "#4727B3"
        : state.isFocused
        ? "rgba(10,10,10,0.2)"
        : "white",
      transition: "0.23s ease",
    }),
    control: (provided) => ({
      ...provided,
      borderColor: "#522CCC",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#522CCC",
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

  // Function to handle changes in breakout room names and participants
  const handleBreakoutRoomChange = (index, key, value) => {
    const newBreakoutRooms = [...breakoutRooms];
    newBreakoutRooms[index][key] = value;
    setBreakoutRooms(newBreakoutRooms);
  };

  // Function to add a new breakout room
  const addBreakoutRoom = () => {
    setBreakoutRooms([...breakoutRooms, { name: "", participants: [""] }]);
  };

  // Function to remove a breakout room
  const removeBreakoutRoom = (index) => {
    const newBreakoutRooms = [...breakoutRooms];
    newBreakoutRooms.splice(index, 1);
    setBreakoutRooms(newBreakoutRooms);
  };
  return (
    <Box sx={box}>
      <Stack sx={stack} spacing={5}>
        <Heading sx={heading}>Generate Meeting</Heading>
        <FormControl>
          <FormLabel>Teacher Name</FormLabel>
          <Input
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            placeholder="Enter Your Name"
            sx={input}
          />
          <FormHelperText>Enter your full name.</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>
            <Flex align="center">
              Course Name
              <Tooltip
                label="Select a predefined course or type your own."
                placement="right"
              >
                <InfoIcon ml={2} color="gray.500" />
              </Tooltip>
            </Flex>
          </FormLabel>
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
        <FormControl>
          <FormLabel>Lesson Name</FormLabel>
          <Input
            value={lessonName}
            onChange={(e) => setLessonName(e.target.value)}
            placeholder="Lesson Name"
            sx={input}
          />
          <FormHelperText>Enter your lesson name.</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            mb={4}
          >
            {isDropdownOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} Breakout
            Rooms(optional)
          </FormLabel>
          {isDropdownOpen && (
            <Box>
              <Button sx={btn_box} onClick={addBreakoutRoom}>
                <SmallAddIcon marginRight={2} /> Add Room
              </Button>
              {breakoutRooms.length > 0
                ? breakoutRooms.map((room, index) => (
                    <Stack key={index} sx={box} spacing={5}>
                      <Input
                        placeholder={`Room ${index + 1} Name`}
                        value={room.name}
                        sx={input}
                        onChange={(e) =>
                          handleBreakoutRoomChange(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                      />

                      <Input
                        placeholder={`Participant emails separated by commas.`}
                        sx={input}
                        value={room.participants.join(", ")}
                        onChange={(e) =>
                          handleBreakoutRoomChange(
                            index,
                            "participants",
                            e.target.value.split(", ")
                          )
                        }
                      />
                      <Button onClick={() => removeBreakoutRoom(index)}>
                        <DeleteIcon marginRight={2} /> Remove Room
                      </Button>
                    </Stack>
                  ))
                : null}
            </Box>
          )}
        </FormControl>
        <AnimatedText />
        <Tooltip label="Click here to create a new meeting" placement="bottom">
          <Button
            onClick={handleCreateMeeting}
            disabled={isLoading}
            isLoading={isLoading}
            sx={btn}
            colorScheme="yellow"
          >
            Create Meeting
          </Button>
        </Tooltip>
      </Stack>
    </Box>
  );
}

export default MeetingForm;
