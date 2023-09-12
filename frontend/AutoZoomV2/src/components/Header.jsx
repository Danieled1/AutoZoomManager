import { Box, Divider, Heading, Text } from "@chakra-ui/react";
import { header_styles } from "../styles/Styles";
import { useMeetingContext } from "../contexts/MeetingContext";

function Header({ openModal, openRecordingsModal }) {
  const { heading, span_box, sub_header } = header_styles;
  const { fetchLiveMeetings } = useMeetingContext();

  // Fetch live meetings when 'r' is clicked
  const handleFetchLiveMeetings = () => {
    fetchLiveMeetings();
    openModal();
  };
  return (
    <>
      <Heading sx={heading}>
        Auto Zoom{" "}
        <Box as="span" onClick={handleFetchLiveMeetings} colorscheme="teal">
          M
        </Box>
        anage
        <Box as="span" onClick={openRecordingsModal} colorscheme="teal">
          r
        </Box>
      </Heading>
      <Text sx={sub_header}>
        <Heading
          as="p"
          color="white"
          bg={"teal.400"}
          fontWeight="bold"
          borderRadius={"10px"}
          p={2}
          // textAlign="center"
          fontSize="2xl"
          // my={4}
        >
          Clicking 'Create Meeting' will open the Zoom meeting in a new tab!
        </Heading>
        <Heading
          bg={"red.500"}
          color="white"
          fontWeight="bold"
          borderRadius={"10px"}
          mt={2}
          p={1}
          fontSize={"md"}
        >
          Please ensure you <u>allow</u> pop-ups from this site.
        </Heading>
      </Text>

      {/* <Divider my={4} /> */}
    </>
  );
}

export default Header;
