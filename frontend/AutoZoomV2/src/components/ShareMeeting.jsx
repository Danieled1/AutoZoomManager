import React, { useEffect } from "react";
import {
  Box,
  Heading,
  Button,
  IconButton,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import { WhatsappShareButton, WhatsappIcon } from "react-share";
import { CopyIcon } from "@chakra-ui/icons";
import { meeting_styles } from "../styles/Styles";

const ShareMeeting = ({
  meetingDetails,
  hasCopied,
  onCopy,
  generateWhatsAppMessage,
}) => {
  const { box, heading, stack, btn_box, btn } = meeting_styles;
  return (
    <Box sx={box}>
      <Stack sx={stack}>
        <Heading sx={heading}>Quick Actions</Heading>
        {meetingDetails.start_url && (
          <Box sx={btn_box}>
            <Tooltip
              label="Click here if the Zoom meeting did not start automatically or crashed."
              placement="bottom"
            >
              <Button
                as="a"
                href={meetingDetails.start_url}
                target="_blank"
                colorScheme="yellow"
                variant="solid"
                sx={btn}
              >
                Create Host Session
              </Button>
            </Tooltip>
          </Box>
        )}
        <Box sx={btn_box}>
          <Tooltip
            label="Click here to copy students join URL"
            placement="bottom"
          >
            <Button
              onClick={onCopy}
              colorScheme="yellow"
              variant="solid"
              sx={btn}
              leftIcon={<CopyIcon />}
            >
              {hasCopied ? "Copied!" : "Copy Students URL"}
            </Button>
          </Tooltip>
        </Box>
        {meetingDetails.join_url && (
          <Box sx={btn_box}>
            <Tooltip
              label="Click here to share the URL via WhatsApp"
              placement="bottom"
            >
              <WhatsappShareButton
                url={meetingDetails.join_url}
                title={generateWhatsAppMessage()}
                sx={btn}
              >
                <IconButton
                  as="a"
                  colorScheme="yellow"
                  variant="solid"
                  aria-label="Share on WhatsApp"
                  sx={btn}
                >
                  <WhatsappIcon size={32} round={true} />
                </IconButton>
              </WhatsappShareButton>
            </Tooltip>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default ShareMeeting;
