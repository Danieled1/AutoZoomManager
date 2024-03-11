import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { MeetingProvider } from "./contexts/MeetingContext.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import ErrorBoundary from "./components/error/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider>
    <ErrorBoundary>
      <MeetingProvider>
        <React.StrictMode>
            <App />
        </React.StrictMode>
      </MeetingProvider>
    </ErrorBoundary>
  </ChakraProvider>
);
