import { Box, Heading, Image } from "@chakra-ui/react";
import { header_styles } from "../styles/Styles";
import { useMeetingContext } from "../contexts/MeetingContext";

function Header({ openModal, openRecordingsModal }) {
  const { heading } = header_styles;
  const { fetchLiveMeetings } = useMeetingContext();

  // Fetch live meetings when 'r' is clicked
  const handleFetchLiveMeetings = () => {
    fetchLiveMeetings();
    openModal();
  };
  return (
    <>
      <Image src="./icons/icons8-zoom-arcade-144.png" />
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
