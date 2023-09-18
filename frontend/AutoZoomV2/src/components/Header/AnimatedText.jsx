import React, { useState, useEffect } from "react";
import { Text, Heading, Box } from "@chakra-ui/react";
import { InfoIcon, WarningIcon } from "@chakra-ui/icons";

const AnimatedText = () => {
  const [showText, setShowText] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(false);
      setShowInfo(true);
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  return (
    <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} m={2} >
      {(showText || hover) && (
        <Text
          sx={{ transition: "opacity 3s ease-in-out" }}
          opacity={showText || hover ? 1 : 0}
        >
          <Heading
            as="p"
            color="white"
            bg="teal.400"
            fontWeight="bold"
            borderRadius= "lg"
            p={2}
            fontSize="2xl"
          >
            Clicking 'Create Meeting' will open the Zoom meeting in a new tab!
          </Heading>
          <Heading
            bg="red.500"
            color="white"
            fontWeight="bold"
            borderRadius= "md"
            mt={2}
            p={1}
            fontSize="md"
          >
            Please ensure you <u>allow</u> pop-ups from this site.
          </Heading>
        </Text>
      )}
      {showInfo && !hover && (
        <Box
          sx={{ transition: "opacity 1s ease-in-out" }}
          opacity={showInfo ? 1 : 0}
          
        >
          <WarningIcon color="red.500" boxSize={10} />
        </Box>
      )}
    </Box>
  );
};

export default AnimatedText;
