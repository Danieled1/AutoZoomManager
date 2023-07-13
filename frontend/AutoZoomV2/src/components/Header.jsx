import { Box, Heading, Text } from "@chakra-ui/react";
import { header_styles } from "../styles/Styles";

function Header({ openModal, openRecordingsModal }) {
  const { heading, span_box, sub_header } = header_styles;
  return (
    <>
      <Heading as='h1' sx={heading}>
        AutoZoom{" "}
        <Box as='span' onClick={openModal} colorschema='teal' sx={span_box}>
          G
        </Box>
        enerato
        <Box
          as='span'
          onClick={openRecordingsModal}
          colorscheme='teal'
          sx={span_box}
        >
          r
        </Box>
      </Heading>
      <Text sx={sub_header}>
        Create and manage your Zoom meetings effortlessly.
      </Text>
    </>
  );
}

export default Header;
