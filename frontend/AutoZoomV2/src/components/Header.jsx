import { Box, Heading, Image } from "@chakra-ui/react";
import { header_styles } from "../styles/Styles";
import { useContext } from "react";
import { useModalsContext } from "../contexts/ModalsContext";

function Header() {
  const { heading } = header_styles;
  const {openLiveUsersModal, openRecordingsModal} = useModalsContext();
  // Fetch live meetings when 'r' is clicked
  const handleFetchLiveMeetings = () => {
    openLiveUsersModal();
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
