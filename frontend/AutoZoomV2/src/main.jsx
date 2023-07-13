import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { MeetingProvider } from "./contexts/MeetingContext.jsx";
import initialUsersMap from "./usersData.js";
import { ChakraProvider } from "@chakra-ui/react";
ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider>
    <MeetingProvider initialUsersMap={initialUsersMap}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </MeetingProvider>
  </ChakraProvider>
);
