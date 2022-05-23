import {
  Button,
  Container,
  SimpleGrid,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { useNavigate } from "react-router-dom";
import FundCard from "../../components/FundCard";
import StatsCard from "../../components/StatsCard";
import {
  useCurrentNetwork,
  useDeployerContract,
  useEvents,
  usePoolData,
} from "../../hooks";
import UniswapLogo from "../../img/uniswap.svg";

export default function Dashboard() {
  const { account } = useEthers();
  const navigate = useNavigate();
  const contract = useDeployerContract();
  const CurrentNetwork = useCurrentNetwork();

  const events = useEvents("LogDeployedIndexContract", contract);
  const fundsDeployed: any[] = events.map((e) => e?.args);

  const { pools, poolsLoading, whitelistedPoolsIds, whitelistedPoolsLoading } =
    usePoolData();

  const handleDetailsClick = (fund: any[]) => {
    navigate(`/funds/${fund[0]}`);
  };

  return (
    <Container maxW="8xl" pb={10}>
      {!account && (
        <Alert status="warning" mb={4} mt={4} borderRadius={12}>
          <AlertIcon />
          <AlertTitle mr={2}>
            You need to connect your wallet to interact with available funds
          </AlertTitle>
        </Alert>
      )}
      <SimpleGrid columns={{ sm: 1, lg: 4 }} spacing={4} mt={4}>
        <Button
          variant="gradient"
          fontWeight="bold"
          minH="60px"
          h="100%"
          fontSize="2xl"
          onClick={() => navigate("/funds/create")}
          borderRadius={12}
        >
          Create your own fund
        </Button>
        <StatsCard
          title="Available Assets"
          number={pools.length}
          icon={UniswapLogo}
          loading={poolsLoading}
        />
        <StatsCard
          title="Whitelisted Assets"
          number={whitelistedPoolsIds.length}
          icon={UniswapLogo}
          loading={whitelistedPoolsLoading}
        />
        <StatsCard
          title={`Available Funds on ${CurrentNetwork.chainName}`}
          number={fundsDeployed.length}
          icon={CurrentNetwork.logo}
          loading={fundsDeployed.length === 0}
        />
      </SimpleGrid>
      <SimpleGrid columns={{ sm: 1, lg: 3 }} spacing={4} mt={4}>
        {fundsDeployed.map((fund) => (
          <FundCard
            key={fund[0]}
            fund={fund}
            isDisabled={!account}
            onDetailsClick={handleDetailsClick}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
}
