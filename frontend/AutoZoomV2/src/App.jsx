import React, { lazy, Suspense, useState } from "react";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { Header, MeetingForm, ModalsContainer } from "./components";
import { useMeetingContext } from "./contexts/MeetingContext";
import { app_styles } from "./styles/Styles";
import { ModalsProvider } from "./contexts/ModalsContext";

const FaviconAttribution = lazy(() =>
  import("./components/FaviconAttribution")
);
const ShareMeeting = lazy(() => import("./components/ShareMeeting"));
const MeetingDetails = lazy(() => import("./components/MeetingDetails"));

const App = () => {
  const { meetingDetails, hasCopied, onCopy, generateWhatsAppMessage } =
    useMeetingContext() || {};
  return (
    <ModalsProvider>
      <Box sx={app_styles.box}>
        <Flex direction="column" align="center" justify="center">
          <Header />
          {/* Create Meeting Box */}
          <MeetingForm />
          {meetingDetails && meetingDetails.join_url && (
            <Suspense fallback={<Spinner color="blue.500" size="xl" />}>
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
        <Suspense fallback={<Spinner color="blue.500" size="xl" />}>
          <FaviconAttribution />
          <ModalsContainer />
        </Suspense>
      </Box>
    </ModalsProvider>
  );
};

export default App;
