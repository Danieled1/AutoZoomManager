import { Box, Divider, Heading, Text } from "@chakra-ui/react";
import { header_styles } from "../styles/Styles";
import { useMeetingContext } from "../contexts/MeetingContext";
import AnimatedText from "./Header/AnimatedText";

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
    </>
  );
}

export default Header;
