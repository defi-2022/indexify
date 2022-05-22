import {
  Button,
  Container,
  Flex,
  Heading,
  useColorMode,
  Box,
  Stack,
  Text,
  Icon,
  Divider,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Gradient } from "../../components/Gradient";
import { BiRightArrow } from "react-icons/bi";
import { useEthers } from "@usedapp/core";
const Landing = () => {
  const { account } = useEthers();
  const { colorMode } = useColorMode();
  const iconColor = colorMode === "light" ? "gray.300" : "gray.600";
  const navigate = useNavigate();
  return (
    <Flex direction="column" justify="center" h="100%">
      <Container maxW="8xl" pb={10}>
        <Flex direction="column">
          <Heading size="4xl" textAlign="left">
            Crypto investing <Gradient>made easy</Gradient>
          </Heading>
          <Heading size="xl" mt={4} color="gray.500" textAlign="left">
            Diversify and earn interests with <u>on chain index funds</u>
          </Heading>
          <Heading size="lg" mt={4} color="gray.500" textAlign="left">
            Connect your wallet to access the dashboard
          </Heading>
        </Flex>
        <Flex justifyContent="left">
          <Button
            variant="gradient"
            fontWeight="700"
            fontSize={18}
            size="lg"
            mt={8}
            onClick={() => navigate("/dashboard")}
            isDisabled={!account}
          >
            Start Investing
          </Button>
        </Flex>

        <Divider my={10} />
        <Stack direction="row" h="300px" w="100%" p={2}>
          <Flex w="50%" direction="column" textAlign="left">
            <Heading size="xl" w="100%" textAlign="left" mb={10}>
              Investors
            </Heading>
            <Text fontWeight={400} mb={2} display="flex" alignItems="center">
              <Icon as={BiRightArrow} mr={4} color={iconColor} />
              Select an index fund with a token composition you like
            </Text>
            <Text fontWeight={400} mb={2} display="flex" alignItems="center">
              <Icon as={BiRightArrow} mr={4} color={iconColor} />
              Invest and get an ERC20 token representing your investment
            </Text>
            {/* <Text fontWeight={400} mb={2} display="flex" alignItems="center">
                <Icon as={BiRightArrow} mr={4} color={iconColor} />
                Decide which portion of the collateral should be earning
                interests
              </Text> */}
            <Text fontWeight={400} mb={2} display="flex" alignItems="center">
              <Icon as={BiRightArrow} mr={4} color={iconColor} />
              Take profit by either selling the index token or redeeming the
              collateral
            </Text>
          </Flex>
          <Flex w="50%" direction="column" textAlign="left">
            <Heading size="xl" w="100%" textAlign="left" mb={10}>
              Managers
            </Heading>
            <Text fontWeight={400} mb={2} display="flex" alignItems="center">
              <Icon as={BiRightArrow} mr={4} color={iconColor} />
              Create an index fund
            </Text>
            <Text fontWeight={400} mb={2} display="flex" alignItems="center">
              <Icon as={BiRightArrow} mr={4} color={iconColor} />
              Select the token distribution and composition
            </Text>
            <Text fontWeight={400} mb={2} display="flex" alignItems="center">
              <Icon as={BiRightArrow} mr={4} color={iconColor} />
              Earn a percentage of each investment made
            </Text>
          </Flex>
        </Stack>
      </Container>
    </Flex>
  );
};

export default Landing;
