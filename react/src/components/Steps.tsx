import { Flex } from "@chakra-ui/react";
import { Step as ChakraStep, Steps as ChakraSteps } from "chakra-ui-steps";

interface StepProps {
  label: string;
  content: JSX.Element;
}

interface StepsProps {
  steps: StepProps[];
  activeStep: number;
}

export default function Steps({ steps, activeStep }: StepsProps) {
  return (
    <Flex flexDir="column" width="100%">
      <ChakraSteps
        activeStep={activeStep}
        colorScheme="blackAlpha"
        orientation="vertical"
      >
        {steps.map(({ label, content }) => (
          <ChakraStep label={label} key={label} />
        ))}
      </ChakraSteps>
    </Flex>
  );
}
