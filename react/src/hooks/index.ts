import { useQuery } from "@apollo/client";
import { Contract } from "@ethersproject/contracts";
import {
  useBlockNumber,
  useCall,
  useContractFunction,
  useNetwork,
} from "@usedapp/core";
import { BigNumber, utils } from "ethers";
import { useContext, useEffect, useState } from "react";
import indexAbi from "../abi/contracts/Index.sol/Index.json";
import indexDeployerAbi from "../abi/contracts/IndexDeployer.sol/IndexDeployer.json";
import { NETWORK_BY_CHAIN_ID } from "../config";
import SubgraphContext from "../context/SubgraphContext";
import {
  GET_AVAILABLE_TOKENS,
  GET_WHITELISTED_POOLS,
} from "../graphql/queries";
import { getAvailablePools, getWhitelistedPools } from "../graphql/utils";

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

  const tokens =
    pools?.reduce((acc: any, pool: any) => {
      const token = pool.token0 || pool.token1;
      acc[token.id] = token;
      return acc;
    }, {}) || {};

  return {
    pools,
    poolsLoading,
    poolsError,
    whitelistedPoolsIds,
    whitelistedPoolsLoading,
    whitelistedPoolsError,
    tokens,
    tokensLoading: poolsLoading,
    tokensError: poolsError,
  };
};

export const useDeployerContract = (): Contract => {
  const dataChainId = useContext(SubgraphContext);
  const { indexDeployerAddress } = NETWORK_BY_CHAIN_ID[dataChainId];

  const indexDeployerInterface = new utils.Interface(indexDeployerAbi);
  const contract = new Contract(
    indexDeployerAddress!,
    indexDeployerInterface
  ) as Contract;
  return contract;
};

export const useCreateIndex = () => {
  const contract = useDeployerContract();

  const {
    state: createIndexState,
    send: createIndex,
    events: createIndexEvents,
  } = useContractFunction(contract, "createIndex", {
    transactionName: "Create Index",
  });

  const indexAddress =
    createIndexEvents?.[0].name === "LogDeployedIndexContract"
      ? createIndexEvents[0].args[0]
      : undefined;

  return {
    createIndexState,
    createIndex,
    createIndexEvents,
    indexAddress,
    contract,
  };
};

export const useCurrentNetwork = () => {
  const dataChainId = useContext(SubgraphContext);
  return NETWORK_BY_CHAIN_ID[dataChainId];
};

export const useIndexContract = (indexAddress: string): Contract => {
  const indexInterface = new utils.Interface(indexAbi);
  const contract = new Contract(indexAddress!, indexInterface) as Contract;
  return contract;
};

export const useBalanceOf = (
  tokenAddress: string | undefined,
  userAddress: string
): BigNumber | undefined => {
  const { value, error } =
    useCall(
      tokenAddress && {
        contract: new Contract(tokenAddress, indexAbi),
        method: "balanceOf",
        args: [userAddress],
      }
    ) ?? {};
  if (error) {
    console.error(error.message);
    return undefined;
  }
  return value?.[0];
};

export const useTotalSupply = (
  tokenAddress: string | undefined
): BigNumber | undefined => {
  const { value, error } =
    useCall(
      tokenAddress && {
        contract: new Contract(tokenAddress, indexAbi),
        method: "totalSupply",
        args: [],
      }
    ) ?? {};
  if (error) {
    console.error(error.message);
    return undefined;
  }
  return value?.[0];
};

export const useEvents = (
  eventName: string,
  contract: Contract,
  options?: { shouldQueryOnce?: boolean }
) => {
  const { network } = useNetwork();
  const chunkSize = 5000;
  const blockNumber = useBlockNumber();
  const CurrentNetwork = useCurrentNetwork();
  const blocksToQuery = blockNumber! - CurrentNetwork.indexDeployerBlockNumber!; //15160
  const chunks = Math.floor(blocksToQuery / chunkSize); // 3 (chunkSize per chunk)
  const reminder = blocksToQuery % chunkSize; // 160
  const [eventsCache, updateEventsCache] = useState<{
    [blockNumber: number]: any[];
  }>({});
  const [timesQueried, updateTimesQueried] = useState(0);

  const getEvents = async () => {
    for (let i = 0; i < chunks; i++) {
      const fromBlock =
        CurrentNetwork.indexDeployerBlockNumber! + chunkSize * i;
      const toBlock =
        CurrentNetwork.indexDeployerBlockNumber! + chunkSize * (i + 1);

      //if last check, query the reminder also
      const toBlockFinal = i === chunks - 1 ? toBlock + reminder : toBlock;
      // always call the last chunk
      if (eventsCache[fromBlock] && i < chunks - 1) {
        continue;
      } else {
        const e = await contract.connect(network.provider!).queryFilter(
          //@ts-ignore
          eventName,
          fromBlock,
          toBlockFinal
        );
        updateEventsCache((prev) => ({
          ...prev,
          [fromBlock]: e,
        }));
      }
    }
    updateTimesQueried((prev) => prev + 1);
  };
  const alreadyQueried = timesQueried > 0 && options?.shouldQueryOnce;
  useEffect(() => {
    if (network.provider && !alreadyQueried) {
      getEvents();
    }
  }, [network, blockNumber]);

  return Object.values(eventsCache).flat();
};
