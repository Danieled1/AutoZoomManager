import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { MeetingProvider } from "./contexts/MeetingContext.jsx";
import initialUsersMap from "./usersData.js";
import { ChakraProvider } from "@chakra-ui/react";
import ErrorBoundary from "./components/error/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider>
    <MeetingProvider initialUsersMap={initialUsersMap}>
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    </MeetingProvider>
  </ChakraProvider>
);
