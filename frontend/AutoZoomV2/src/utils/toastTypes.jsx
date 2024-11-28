import { Box, Progress, Text, useToast } from "@chakra-ui/react";

export const useCustomToast = () => {
  const toast = useToast();
  let toastId = null;

  const successToast = (title = "Success", message) => {
    toast({
      title,
      description: message,
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom-center",
    });
  };

  const errorToast = (title = "Error", message) => {
    toast({
      title,
      description: message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-center",
    });
  };

  const downloadLogToast = (
    title = "Downloads Process",
    message,
    currentPercentage = 0,
    overallPercentage = 0,
    isComplete = false
  ) => {
    const content = (
      <Box
        bg="white"
        borderRadius="2xl"
        boxShadow="0px 12px 28px rgba(0, 0, 0, 0.2)"
        padding="4"
        width="full"
        fontFamily="Roboto, sans-serif"
      >
        <Text
          fontSize="lg"
          fontWeight="bold"
          color={isComplete ? "#6836FF" : "#FCB72B"}
          textAlign="center"
          mb="3"
        >
          {message}
        </Text>
        <Box mb={4}>
          <Text fontSize="sm" color="gray.700" mb={1}>
            Current File Progress:{" "}
            <Text as="span" fontWeight="bold" color="#522CCC">
              {currentPercentage.toFixed(2)}%
            </Text>
          </Text>
          <Progress
            value={currentPercentage}
            size="lg"
            borderRadius="lg"
            colorScheme="blue"
            bg="gray.200"
          />
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.700" mb={1}>
            Overall Progress:{" "}
            <Text as="span" fontWeight="bold" color={isComplete ? "#6836FF" : "#522CCC"}>
              {overallPercentage.toFixed(2)}%
            </Text>
          </Text>
          <Progress
            value={overallPercentage}
            size="lg"
            borderRadius="lg"
            colorScheme={isComplete ? "green" : "purple"}
            bg="gray.200"
          />
        </Box>
        {isComplete && (
          <Text
            mt={3}
            fontSize="md"
            color="#6836FF"
            fontWeight="bold"
            textAlign="center"
          >
            All downloads completed successfully!
          </Text>
        )}
      </Box>
    );
  
    if (!toastId) {
      // Create a new toast
      toastId = toast({
        id: "download-log-toast",
        title,
        description: content,
        status: isComplete ? "success" : "info",
        duration: isComplete ? 5000 : null,
        isClosable: true,
        position: "top-right",
      });
    } else {
      // Update existing toast
      toast.update("download-log-toast", {
        title,
        description: content,
        status: isComplete ? "success" : "info",
        duration: isComplete ? 5000 : null,
        isClosable: true,
      });
      if (isComplete) toastId = null; // Reset toast ID after completion
    }
  };
  
  
  return { successToast, errorToast, downloadLogToast };
};
