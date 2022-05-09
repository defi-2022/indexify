import { ApolloProvider } from "@apollo/client";
import { useEthers } from "@usedapp/core";
import { Mainnet } from "./config";
import React, { useEffect } from "react";
import App from "./App";
import { NETWORK_BY_CHAIN_ID } from "./config";
import {
  getEthereumChainObjectForWallet,
  isChainIdSupported,
} from "./lib/network";

const NetworkLayer = () => {
  const { switchNetwork, chainId, library, account } = useEthers();
  const defaultChainId = chainId || Mainnet.chainId;
  const [dataChainId, setDataChainId] = React.useState(defaultChainId);
  const [client, setClient] = React.useState<any>(
    isChainIdSupported(defaultChainId)
      ? NETWORK_BY_CHAIN_ID[defaultChainId].graphqlClient
      : NETWORK_BY_CHAIN_ID[Mainnet.chainId].graphqlClient
  );

  useEffect(() => {
    const supported = isChainIdSupported(dataChainId);
    if (supported && dataChainId) {
      setClient(NETWORK_BY_CHAIN_ID[dataChainId].graphqlClient);
    }
  }, [dataChainId]);

  useEffect(() => {
    const supported = isChainIdSupported(dataChainId);
    if (chainId && chainId !== dataChainId && supported) {
      setDataChainId(chainId);
    }
  }, [chainId]);

  const handleSelectNetwork = async (_chainId: number) => {
    console.log({ account, chainId, _chainId });
    setDataChainId(_chainId);
    if (account && _chainId !== chainId) {
      try {
        await switchNetwork(_chainId);
        console.log("after switch network");
      } catch (switchError) {
        try {
          const chain = getEthereumChainObjectForWallet(_chainId);
          await library?.send("wallet_addEthereumChain", [chain]);
        } catch (addError: any) {
          throw addError;
        }
      }
    }
  };

  return (
    <ApolloProvider client={client}>
      <App dataChainId={dataChainId} onSelectNetwork={handleSelectNetwork} />
    </ApolloProvider>
  );
};

export default NetworkLayer;