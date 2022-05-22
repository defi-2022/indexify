import { Badge, Flex, Link, Text } from "@chakra-ui/react";
import { shortenAddress } from "@usedapp/core";
import { useCurrentNetwork } from "../../hooks";
import { ethers } from "ethers";
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
    totalValueLockedUSD: string;
  };
}
export function PoolInfoCell({ pool }: PoolInfoCellProps) {
  const CurrentNetwork = useCurrentNetwork();
  return (
    <Flex direction="column">
      <Flex align="center">
        <Text fontSize="sm" fontWeight={700} mr={2}>
          {`${pool.token0?.symbol || CurrentNetwork.currencyInfo.symbol} / ${
            pool.token1?.symbol || CurrentNetwork.currencyInfo.symbol
          }`}{" "}
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
      <Text>
        <b>TVL (USD)</b>: ${Number(pool.totalValueLockedUSD).toFixed(2)}
      </Text>
    </Flex>
  );
}
