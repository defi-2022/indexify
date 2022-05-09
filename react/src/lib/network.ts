import { NETWORK_BY_CHAIN_ID } from "../config";

export const isChainIdSupported = (chainId: number) => {
  return !!NETWORK_BY_CHAIN_ID[chainId];
};

export const getEthereumChainObjectForWallet = (chainId: number) => {
  try {
    const supported = isChainIdSupported(chainId);
    if (!supported) {
      throw "NOT_SUPPORTED";
    }
    return {
      chainId: `0x${chainId.toString(16)}`,
      chainName: NETWORK_BY_CHAIN_ID[chainId].chainName,
      nativeCurrency: NETWORK_BY_CHAIN_ID[chainId].currencyInfo,
      rpcUrls: [NETWORK_BY_CHAIN_ID[chainId].rpcUrl],
      blockExplorerUrls: [NETWORK_BY_CHAIN_ID[chainId].blockExplorerUrl],
    };
  } catch (e) {
    throw e;
  }
};
