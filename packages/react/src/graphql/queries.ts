import { gql } from "@apollo/client";

export const GET_AVAILABLE_TOKENS = (token: string) => gql`
  {
    pairToToken0: pools(
      where: { token0: "${token}" }
      orderBy: totalValueLockedUSD
      orderDirection: desc
    ) {
      token1 {
        id
        symbol
        name
        decimals
        derivedETH
        __typename
      }
      id
      feeTier
      liquidity
      sqrtPrice
      tick
      token0Price
      token1Price
      volumeUSD
      txCount
      totalValueLockedToken0
      totalValueLockedToken1
      totalValueLockedUSD
      __typename
    }
    pairToToken1: pools(
      where: { token1: "${token}" }
      orderBy: totalValueLockedUSD
      orderDirection: desc
    ) {
      token0 {
        id
        symbol
        name
        decimals
        derivedETH
        __typename
      }
      id
      feeTier
      liquidity
      sqrtPrice
      tick
      token0Price
      token1Price
      volumeUSD
      txCount
      totalValueLockedToken0
      totalValueLockedToken1
      totalValueLockedUSD
      __typename
    }
  }
`;

export const GET_WHITELISTED_POOLS = (token: string) => gql`
  {
    token(id: "${token}") {
      symbol
      name
      whitelistPools(orderBy: totalValueLockedUSD, orderDirection: desc) {
        id
        __typename
      }
    }
  }
`;
