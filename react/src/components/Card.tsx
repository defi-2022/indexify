import {
  Avatar,
  Box,
  ChakraProps,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

interface CardProps extends ChakraProps {
  children: React.ReactNode;
}
const Card = ({ children, ...props }: CardProps) => {
  const bg = useColorModeValue("gray.100", "gray.700");
  return (
    <Box
      bg={bg}
      borderRadius="3xl"
      p={4}
      position="relative"
      {...props}
      //   backgroundImage="linear-gradient(112deg, rgb(170, 255, 236) -63.59%, rgb(255, 78, 205) -20.3%, rgb(0, 112, 243) 70.46%)"
    >
      {children}
    </Box>
  );
};

export default Card;
