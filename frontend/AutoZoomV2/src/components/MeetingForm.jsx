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
  Image,
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
    breakoutRooms,
    setBreakoutRooms,
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
        <FormControl>
          <FormLabel>Teacher Name</FormLabel>
          <Input
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            placeholder="Name"
            borderColor="#522CCC"
            _hover={{
              borderColor: "#522CCC",
            }}
            _focus={{
              borderColor: "#522CCC",
              boxShadow: "0 0 0 1px #522CCC",
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
        <FormControl>
          <FormLabel>Breakout Rooms</FormLabel>
          {breakoutRooms &&
            breakoutRooms.length > 0 &&
            breakoutRooms.map((room, index) => (
              <Box key={index}>
                <Input
                  placeholder={`Room ${index + 1} Name`}
                  value={room.name}
                  onChange={(e) =>
                    handleBreakoutRoomChange(index, "name", e.target.value)
                  }
                />
                <Input
                  placeholder={`Room ${
                    index + 1
                  } Participants (comma separated)`}
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
                  Remove Room
                </Button>
              </Box>
            ))}
          <Button onClick={addBreakoutRoom}>Add Breakout Room</Button>
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
