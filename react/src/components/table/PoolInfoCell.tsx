import { Badge, Flex, Link, Text } from "@chakra-ui/react";
import { shortenAddress } from "@usedapp/core";
import { useContext } from "react";
import { Localhost, Mainnet, Optimism, Polygon } from "../../config";
import SubgraphContext from "../../context/SubgraphContext";

interface PoolInfoCellProps {
  pool: {
    token0?: {
      symbol: string;
    };
    token1?: {
      symbol: string;
    };
    feeTier: number;
    id: string;
  };
}
export function PoolInfoCell({ pool }: PoolInfoCellProps) {
  const dataChainId = useContext(SubgraphContext);
  const networks = {
    [Mainnet.chainId]: "ethereum",
    [Optimism.chainId]: "optimism",
    [Polygon.chainId]: "polygon",
    [Localhost.chainId]: "ethereum",
  };
  return (
    <Flex direction="column">
      <Flex align="center">
        <Text fontSize="sm" fontWeight={700} mr={2}>
          {`${pool.token0?.symbol || "ETH"} / ${pool.token1?.symbol || "ETH"}`}{" "}
        </Text>
        <Badge
          colorScheme={
            Number(pool.feeTier) <= 500
              ? "green"
              : Number(pool.feeTier) <= 3000
              ? "yellow"
              : "red"
          }
          mr="auto"
        >
          {pool.feeTier / 10000}%
        </Badge>
      </Flex>
      <Link
        target="_blank"
        href={`https://info.uniswap.org/#/pools/${pool.id}`}
        mb={2}
      >
        <Text fontSize="sm">{shortenAddress(pool.id)}</Text>
      </Link>
    </Flex>
  );
}
