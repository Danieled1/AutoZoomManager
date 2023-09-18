import React, { useState, useEffect } from "react";
import { Text, Heading, Box } from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons";

const AnimatedText = () => {
  const [showText, setShowText] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(false);
      setShowInfo(true);
    }, 1000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  return (
    <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {(showText || hover) && (
        <Text
          sx={{ transition: "opacity 3s ease-in-out" }}
          opacity={showText || hover ? 1 : 0}
        >
          <Heading
            as="p"
            color="teal.500"
            fontWeight="bold"
            borderRadius="lg"
            p={2}
            fontSize="xl"
            textAlign={"center"}
          >
            Clicking Create Meeting will open the Zoom meeting in a new tab!
          </Heading>
          <Heading
            color="red.500"
            fontWeight="bold"
            borderRadius="md"
            mt={2}
            p={1}
            fontSize="md"
            textAlign={"center"}
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
          <WarningTwoIcon color="yellow.400" boxSize={10} />
        </Box>
      )}
    </Box>
  );
};

export default AnimatedText;
