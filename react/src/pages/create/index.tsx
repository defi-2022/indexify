import {
  Box,
  Container,
  Flex,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSteps } from "chakra-ui-steps";
import { useState } from "react";
import Steps from "../../components/Steps";
import Basic from "./steps/Basic";
import Composition from "./steps/Composition";
import Intro from "./steps/Intro";
import Review from "./steps/Review";
import Weighting from "./steps/Weighting";

export default function FundCreate() {
  const [fundDetails, setFundDetails] = useState({
    name: "",
    symbol: "",
  });
  const [selectedPools, setSelectedPools] = useState<string[]>([]);
  const [selectedWeights, setSelectedWeights] = useState<number[]>([]);

  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

  const divisorColor = useColorModeValue("gray.100", "gray.700");

  const steps = [
    { label: "Intro", content: Intro },
    {
      label: "Basic Information",
      content: (props: any) => <Basic {...props} onSubmit={setFundDetails} />,
    },
    {
      label: "Composition",
      content: (props: any) => (
        <Composition
          {...props}
          name={fundDetails.name}
          symbol={fundDetails.symbol}
          onSubmit={setSelectedPools}
        />
      ),
    },
    {
      label: "Weighting",
      content: (props: any) => (
        <Weighting
          {...props}
          name={fundDetails.name}
          symbol={fundDetails.symbol}
          selectedPools={selectedPools}
          onSubmit={setSelectedWeights}
        />
      ),
    },
    {
      label: "Review",
      content: (props: any) => (
        <Review
          {...props}
          name={fundDetails.name}
          symbol={fundDetails.symbol}
          selectedPools={selectedPools}
          selectedWeights={selectedWeights}
        />
      ),
    },
  ];

  const CurrentStep = steps[activeStep].content;
  return (
    <Container maxW="8xl" pb={10}>
      <Heading mt={10}>Create a Fund</Heading>
      <Flex gap={10}>
        <Box my={10} flexShrink={0}>
          {/* @ts-ignore */}
          <Steps steps={steps} activeStep={activeStep} />
        </Box>
        <Box minH="100%" bg={divisorColor} w="1px" mt={10} mb={4} />
        <Flex direction="column" w="100%">
          <Box my={10}>
            <CurrentStep
              activeStep={activeStep}
              stepsLength={steps.length}
              reset={reset}
              prevStep={prevStep}
              nextStep={nextStep}
            />
          </Box>
        </Flex>
      </Flex>
    </Container>
  );
}
