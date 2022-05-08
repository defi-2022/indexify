import {
  Mainnet,
  Optimism,
  Polygon,
  Chain,
  OptimismKovan,
  Mumbai,
} from "@usedapp/core";

export type Networks = "mainnet" | "polygon" | "optimism";

export const MAINNET_WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
export const OPTIMISM_WETH = "0x4200000000000000000000000000000000000006";
export const OPTIMISM_KOVAN_WETH = "0x4200000000000000000000000000000000000006";
export const POLYGON_WMATIC = "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270";
export const POLYGON_MUMBAI = "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889";

export type NetworkCurriencies = {
  [key: string]: string;
};

export const NETWORK_CURRENCIES: NetworkCurriencies = {
  [Mainnet.chainName]: MAINNET_WETH,
  [Optimism.chainName]: OPTIMISM_WETH,
  [OptimismKovan.chainName]: OPTIMISM_KOVAN_WETH,
  [Polygon.chainName]: POLYGON_WMATIC,
  [Mumbai.chainName]: POLYGON_MUMBAI,
};

type NetworkByChainId = { [x: number]: Chain };
type RPCUrlByChainId = { [x: number]: string };
type NetworkCurrienciesByChainId = {
  [x: string]: {
    name: string;
    symbol: string;
    decimals: number;
  };
};

export const NETWORK_BY_CHAIN_ID: NetworkByChainId = {
  [Mainnet.chainId]: Mainnet,
  [Optimism.chainId]: Optimism,
  [OptimismKovan.chainId]: OptimismKovan,
  [Polygon.chainId]: Polygon,
  [Mumbai.chainId]: Mumbai,
};

export const RPC_URL_BY_CHAIN_ID: RPCUrlByChainId = {
  [Optimism.chainId]: "https://mainnet.optimism.io",
  [OptimismKovan.chainId]: "https://kovan.optimism.io",
  [Polygon.chainId]: "https://polygon-rpc.com",
  [Mumbai.chainId]: "https://rpc-mumbai.matic.today",
};

export const BLOCK_EXPLORER_URL_BY_CHAIN_ID: RPCUrlByChainId = {
  [Mainnet.chainId]: "https://etherscan.io",
  [Optimism.chainId]: "https://optimistic.etherscan.io/",
  [OptimismKovan.chainId]: "https://kovan-optimistic.etherscan.io/",
  [Polygon.chainId]: "https://polygonscan.com/",
  [Mumbai.chainId]: "https://mumbai.polygonscan.com/",
};

export const NATIVE_CURRENCY_BY_CHAIN_ID: NetworkCurrienciesByChainId = {
  [Mainnet.chainId]: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  [Optimism.chainId]: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  [OptimismKovan.chainId]: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  [Polygon.chainId]: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  [Mumbai.chainId]: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
};
