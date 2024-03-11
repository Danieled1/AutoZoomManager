import React from "react";
import { Box, Text, Button, Image, Flex } from "@chakra-ui/react";
import { app_styles } from "../../styles/Styles";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box role="alert" sx={app_styles.box}>
          <Flex direction="column" align="center" justify="center">
            <Image src="../../icons/icons8-zoom-arcade-144.png" mb={4} />
            <Text fontSize="xl" mb={4}>
              Oops! Something went wrong.
            </Text>
            <Text fontSize="md" mb={4}>
              We're sorry for the inconvenience. Please try again.
            </Text>
            <Text fontSize="md" mb={4}>
              {this.state.error && this.state.error.toString()}
            </Text>
            <Text fontSize="md" mb={4} textAlign={"center"}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </Text>
            <Button colorScheme="teal" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </Flex>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
