import { useToast } from "@chakra-ui/react";

export const useCustomToast = () => {
    const toast = useToast();
  
    const successToast = (title =  "Success",message) => {
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
    return { successToast, errorToast };
};