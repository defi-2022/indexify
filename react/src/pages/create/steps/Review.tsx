import { Heading, Text, Button, Flex } from "@chakra-ui/react";

interface ReviewProps {
  activeStep?: number;
  nextStep: () => void;
  prevStep?: () => void;
  reset?: () => void;
  stepsLength?: number;
  name: string;
  symbol: string;
  onSubmit: (poolIds: string[]) => void;
  selectedPools: string[];
  selectedWeights: number[];
}

export default function Review({
  name,
  symbol,
  selectedPools,
  selectedWeights,
  prevStep,
}: ReviewProps) {
  return (
    <>
      <Heading size="xl" w="100%" textAlign="left" mb={10}>
        Review
      </Heading>
      {/* <Text fontWeight={400} mb={2} display="flex" alignItems="center">
        <pre>
          <code>
            {JSON.stringify({ name, symbol, selectedPools, selectedWeights })}
          </code>
        </pre>
      </Text> */}
      <Heading size={"lg"}>${symbol}</Heading>
      <Text fontSize="lg">{name}</Text>
      <Flex justify="flex-end" mt={4}>
        <Button onClick={prevStep} mr={4} variant="ghost">
          Prev
        </Button>
        <Button variant="gradient" type="submit">
          Next
        </Button>
      </Flex>
    </>
  );
}
