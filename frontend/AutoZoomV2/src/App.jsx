import React, { lazy, Suspense, useState } from 'react';
import { Box, Flex } from "@chakra-ui/react";
import { Header, MeetingForm } from "./components";
import { useMeetingContext } from "./contexts/MeetingContext";
import { app_styles } from "./styles/Styles";

const FaviconAttribution = lazy(() =>
  import("./components/FaviconAttribution")
);
const ShareMeeting = lazy(() => import("./components/ShareMeeting"));
const MeetingDetails = lazy(() => import("./components/MeetingDetails"));

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
      <Flex direction="column" align="center" justify="center">
        <Header
          openModal={openModal}
          openRecordingsModal={openRecordingsModal}
        />
        {/* Create Meeting Box */}
        <MeetingForm />
        {meetingDetails && meetingDetails.join_url && (
          <Suspense fallback={<div>Loading meeting components...</div>}>
            <>
              <ShareMeeting
                meetingDetails={meetingDetails}
                hasCopied={hasCopied}
                onCopy={onCopy}
                generateWhatsAppMessage={generateWhatsAppMessage}
              />
              <MeetingDetails meetingDetails={meetingDetails} />
            </>
          </Suspense>
        )}
      </Flex>
      <Suspense fallback={<div>Loading...</div>}>
        <FaviconAttribution />
      </Suspense>
    </Box>
  );
};

export default App;
