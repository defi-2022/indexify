import { Heading, Text, Flex, Button } from "@chakra-ui/react";

interface StepProps {
  activeStep: number;
  nextStep: () => void;
  prevStep: () => void;
  reset?: () => void;
  stepsLength: number;
}

export default function Intro({
  activeStep,
  nextStep,
  prevStep,
  reset,
  stepsLength,
}: StepProps) {
  return (
    <>
      <Heading size="xl" w="100%" textAlign="left" mb={10}>
        How it works
      </Heading>
      <Text fontWeight={400} mb={2} display="flex" alignItems="center">
        This form will let you create a new investment fund. You will be able to
        select the composition, management procedures and fees.
      </Text>
      <Text fontWeight={400} mb={2} display="flex" alignItems="center">
        After publishing your fund, you and others will be able to invest on it.
        For each investment made by a user, you will be able to see the details
        of the investment and also earn a comission
      </Text>
      <Flex width="100%" justify="flex-end" mt={10}>
        <Button isDisabled mr={4} onClick={prevStep} variant="ghost">
          Prev
        </Button>
        <Button variant="gradient" onClick={nextStep} type="submit">
          Next
        </Button>
      </Flex>
    </>
  );
}
