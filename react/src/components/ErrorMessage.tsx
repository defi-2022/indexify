import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import React from "react";

interface ErrorMessageProps {
  show: boolean;
  title?: string;
  description?: string;
}

const ErrorMessage = ({ show, title, description }: ErrorMessageProps) => {
  if (!show) {
    return null;
  }
  return (
    <Alert status="error">
      <AlertIcon />
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  );
};

export default ErrorMessage;
