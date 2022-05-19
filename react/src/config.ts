import {
  Chain,
  Localhost as LocalhostDapp,
  Mainnet as MainnetDapp,
  Optimism as OptimismDapp,
  Polygon as PolygonDapp,
} from "@usedapp/core";
import EthereumLogo from "./img/ethereum.svg";
import OptimismLogo from "./img/optimism.svg";
import PolygonLogo from "./img/polygon.png";
import { ApolloClient, InMemoryCache } from "@apollo/client";

export const MAINNET_WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
export const OPTIMISM_WETH = "0x4200000000000000000000000000000000000006";
export const OPTIMISM_KOVAN_WETH = "0x4200000000000000000000000000000000000006";
export const POLYGON_WMATIC = "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270";
export const POLYGON_MUMBAI = "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889";

export interface CurrencyInfo {
  name: string;
  symbol: string;
  decimals: number;
}

export interface ExtendedChain extends Chain {
  currency: string;
  currencyInfo: CurrencyInfo;
  enabled: boolean;
  logo: string;
  rpcUrl?: string;
  graphqlClient?: ApolloClient<any>;
  infuraUrl: string;
}

export const Mainnet: ExtendedChain = {
  ...MainnetDapp,
  logo: EthereumLogo,
  enabled: true,
  currency: MAINNET_WETH,
  currencyInfo: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  graphqlClient: new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
  }),
  infuraUrl: process.env.REACT_APP_MAINNET_INFURA_URL!,
};

export const Optimism: ExtendedChain = {
  ...OptimismDapp,
  logo: OptimismLogo,
  enabled: true,
  currency: OPTIMISM_WETH,
  currencyInfo: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrl: "https://mainnet.optimism.io",
  graphqlClient: new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis",
  }),
  infuraUrl: process.env.REACT_APP_OPTIMISM_INFURA_URL!,
};

export const Polygon: ExtendedChain = {
  ...PolygonDapp,
  logo: PolygonLogo,
  enabled: true,
  currency: POLYGON_WMATIC,
  currencyInfo: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrl: "https://polygon-rpc.com",
  graphqlClient: new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon",
  }),
  infuraUrl: process.env.REACT_APP_POLYGON_INFURA_URL!,
};

export const Localhost: ExtendedChain = {
  ...MainnetDapp, // Mainnet fork
  chainName: "Localhost",
  chainId: 1337,
  logo: EthereumLogo,
  enabled: true,
  currency: MAINNET_WETH,
  currencyInfo: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrl: "https://localhost:8545",
  graphqlClient: new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
  }),
  infuraUrl: "http://localhost:8545",
};

export const ENABLED_NETWORKS: ExtendedChain[] = [
  Mainnet,
  Optimism,
  Polygon,
  Localhost,
].filter((chain) => chain.enabled);

export const NETWORK_BY_CHAIN_ID: { [chainId: number]: ExtendedChain } =
  ENABLED_NETWORKS.reduce(
    (acc, chain) => ({ ...acc, [chain.chainId]: chain }),
    {}
  );

export const getUseDappConfig = () => {
  return {
    readOnlyChainId: Mainnet.chainId,
    readOnlyUrls: ENABLED_NETWORKS.reduce(
      (acc: { [x: number]: string }, network: ExtendedChain) => {
        acc[network.chainId] = network.infuraUrl;
        return acc;
      },
      {}
    ),
    multicallAddresses: {
      1337: "0x1780bcf4103d3f501463ad3414c7f4b654bb7afd",
    },
  };
};
