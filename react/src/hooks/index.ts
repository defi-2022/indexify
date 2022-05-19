import { useQuery } from "@apollo/client";
import { NETWORK_BY_CHAIN_ID } from "../config";
import {
  GET_AVAILABLE_TOKENS,
  GET_WHITELISTED_POOLS,
} from "../graphql/queries";
import { getAvailablePools, getWhitelistedPools } from "../graphql/utils";
import { useContext } from "react";
import SubgraphContext from "../context/SubgraphContext";

export const usePoolData = () => {
  const dataChainId = useContext(SubgraphContext);
  const { currency } = NETWORK_BY_CHAIN_ID[dataChainId];
  const {
    data: pools,
    loading: poolsLoading,
    error: poolsError,
  } = getAvailablePools(useQuery(GET_AVAILABLE_TOKENS(currency)));

  const {
    data: whitelistedPoolsIds,
    loading: whitelistedPoolsLoading,
    error: whitelistedPoolsError,
  } = getWhitelistedPools(useQuery(GET_WHITELISTED_POOLS(currency)));

  return {
    pools,
    whitelistedPoolsIds,
    poolsLoading,
    poolsError,
    whitelistedPoolsLoading,
    whitelistedPoolsError,
  };
};
