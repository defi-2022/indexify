import { Button, Container, SimpleGrid } from "@chakra-ui/react";
import { useNetwork } from "@usedapp/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FundCard from "../../components/FundCard";
import StatsCard from "../../components/StatsCard";
import {
  useCurrentNetwork,
  useDeployerContract,
  usePoolData,
} from "../../hooks";
import UniswapLogo from "../../img/uniswap.svg";

export default function Dashboard() {
  const { network } = useNetwork();
  const navigate = useNavigate();
  const contract = useDeployerContract();
  const CurrentNetwork = useCurrentNetwork();
  const [fundsDeployed, setFundsDeployed] = useState<any[]>([]);

  const getFunds = async () => {
    const events = await contract.connect(network.provider!).queryFilter(
      //@ts-ignore
      "LogDeployedIndexContract",
      CurrentNetwork.indexDeployerBlockNumber,
      "latest"
    );
    setFundsDeployed(events.map((e) => e?.args));
  };

  const { pools, poolsLoading, whitelistedPoolsIds, whitelistedPoolsLoading } =
    usePoolData();

  useEffect(() => {
    if (network.provider) {
      getFunds();
    }
  }, [network]);

  const handleDetailsClick = (fund: any[]) => {
    navigate(`/funds/${fund[0]}`);
  };

  return (
    <Container maxW="8xl" pb={10}>
      <SimpleGrid columns={{ sm: 1, lg: 4 }} spacing={4} mt={4}>
        <Button
          variant="gradient"
          fontWeight="bold"
          minH="60px"
          h="100%"
          fontSize="2xl"
          onClick={() => navigate("/funds/create")}
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
            onDetailsClick={handleDetailsClick}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
}
