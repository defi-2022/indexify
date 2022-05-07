import { QueryResult } from "@apollo/client";

export const getAvailablePools = (availablePools: QueryResult) => {
  const data = availablePools.data
    ? availablePools.data.pairToToken0
        .concat(availablePools.data.pairToToken1)
        .sort((a: any, b: any) => {
          return a.totalValueLockedUSD - b.totalValueLockedUSD;
        })
        .reverse()
    : [];
  return {
    ...availablePools,
    data,
  };
};

export const getWhitelistedPools = (whitelistedPools: QueryResult) => {
  const data =
    whitelistedPools.data?.token?.whitelistPools?.map((pool: any) => pool.id) ||
    [];
  return {
    ...whitelistedPools,
    data,
  };
};
