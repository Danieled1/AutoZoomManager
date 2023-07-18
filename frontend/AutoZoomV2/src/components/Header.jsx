import { Box, Heading, Text } from "@chakra-ui/react";
import { header_styles } from "../styles/Styles";
import { Wave } from "react-animated-text";
import React from "react";

function Header({ openModal, openRecordingsModal }) {
  const { heading, span_box, sub_header, waveEffect } = header_styles;

  const generateWaveEffect = () => (
    <Wave
      text={"AutoZoom Generator"}
      effect={"fadeOut"}
      effectChange={0.2}
    />
  );

  return (
    <>
      <Heading sx={heading}>
        AutoZoom{" "}
        <Box as="span" onClick={openModal} colorscheme="teal" sx={span_box}>
          G
        </Box>
        enerato
        <Box
          as="span"
          onClick={openRecordingsModal}
          colorscheme="teal"
          sx={span_box}
        >
          r
        </Box>
        {/* {generateWaveEffect()} */}
      </Heading>
      <Text sx={sub_header}>
        Create and manage your Zoom meetings effortlessly.
      </Text>
    </>
  );
}

export default Header;
