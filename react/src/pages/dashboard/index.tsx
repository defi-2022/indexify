import { useQuery } from "@apollo/client";
import {
  Container,
  SimpleGrid,
  Button,
  Heading,
  Text,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { useContext } from "react";
import Card from "../../components/Card";
import StatsCard from "../../components/StatsCard";
import { NETWORK_BY_CHAIN_ID } from "../../config";
import SubgraphContext from "../../context/SubgraphContext";
import {
  GET_AVAILABLE_TOKENS,
  GET_WHITELISTED_POOLS,
} from "../../graphql/queries";
import { getAvailablePools, getWhitelistedPools } from "../../graphql/utils";
import { BiChart } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const dataChainId = useContext(SubgraphContext);
  const { currency } = NETWORK_BY_CHAIN_ID[dataChainId];

  const { data: pools } = getAvailablePools(
    useQuery(GET_AVAILABLE_TOKENS(currency))
  );

  const { data: whitelistedPoolsIds } = getWhitelistedPools(
    useQuery(GET_WHITELISTED_POOLS(currency))
  );

  return (
    <Container maxW="8xl" pb={10}>
      <SimpleGrid columns={{ sm: 1, lg: 3 }} spacing={4} mt={4}>
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
          icon={NETWORK_BY_CHAIN_ID[dataChainId].logo}
        />
        <StatsCard
          title="Whitelisted Assets"
          number={whitelistedPoolsIds.length}
          icon={NETWORK_BY_CHAIN_ID[dataChainId].logo}
        />
      </SimpleGrid>
      {/* {pools.map((pool: any) => {
        const token = pool.token0 || pool.token1;
        return (
          <div key={pool.id}>
            {token.name} : {pool.totalValueLockedUSD}{" "}
            {whitelistedPoolsIds.includes(pool.id) ? "WHITELISTED" : "---"}
          </div>
        );
      })} */}
    </Container>
  );
}
