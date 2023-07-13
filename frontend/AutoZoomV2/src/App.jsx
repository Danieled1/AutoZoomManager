import { Box, Flex } from "@chakra-ui/react";
import {
  Header,
  MeetingForm,
  MeetingDetails,
  ShareMeeting,
  FaviconAttribution,
} from "./components";
import { useMeetingContext } from "./contexts/MeetingContext";
import { app_styles } from "./styles/Styles";

const App = () => {
  const {
    meetingDetails,
    openModal,
    openRecordingsModal,
    hasCopied,
    onCopy,
    generateWhatsAppMessage,
  } = useMeetingContext() || {};
  return (
    <Box sx={app_styles.box}>
      <Flex direction='column' align='center' justify='center'>
        <Header
          openModal={openModal}
          openRecordingsModal={openRecordingsModal}
        />
        {/* Create Meeting Box */}
        <MeetingForm />
        {meetingDetails && meetingDetails.join_url && (
          <>
            {/* Share Meeting Box */}
            <ShareMeeting
              meetingDetails={meetingDetails}
              hasCopied={hasCopied}
              onCopy={onCopy}
              generateWhatsAppMessage={generateWhatsAppMessage}
            />
            {/* Meeting Details Box */}
            <MeetingDetails meetingDetails={meetingDetails} />
          </>
        )}
      </Flex>
      <FaviconAttribution />
    </Box>
  );
};

export default App;
