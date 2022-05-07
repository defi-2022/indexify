import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/inter/100.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import {
  DAppProvider,
  Mainnet,
  Optimism,
  OptimismKovan,
  Polygon,
  Mumbai,
  useEthers,
} from "@usedapp/core";
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { CLIENTS } from "./graphql/client";
import {
  BLOCK_EXPLORER_URL_BY_CHAIN_ID,
  NATIVE_CURRENCY_BY_CHAIN_ID,
  NETWORK_BY_CHAIN_ID,
  RPC_URL_BY_CHAIN_ID,
} from "./lib/constants";
import reportWebVitals from "./reportWebVitals";
import theme from "./theme";
import "./index.css";

const config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: process.env.REACT_APP_MAINNET_INFURA_URL!,
    [Optimism.chainId]: process.env.REACT_APP_OPTIMISM_INFURA_URL!,
    [OptimismKovan.chainId]: process.env.REACT_APP_OPTIMISM_KOVAN_INFURA_URL!,
    [Polygon.chainId]: process.env.REACT_APP_POLYGON_INFURA_URL!,
    [Mumbai.chainId]: process.env.REACT_APP_MUMBAI_INFURA_URL!,
  },
};

const container = document.getElementById("root");
const root = createRoot(container!);

const Dapp = () => {
  const { switchNetwork, chainId, library, account } = useEthers();
  const defaultChainId = chainId || Mainnet.chainId;
  const [dataChainId, setDataChainId] = React.useState(defaultChainId);
  const [client, setClient] = React.useState<any>(
    CLIENTS[NETWORK_BY_CHAIN_ID[defaultChainId].chainName]
  );

  useEffect(() => {
    if (dataChainId) {
      setClient(CLIENTS[NETWORK_BY_CHAIN_ID[dataChainId].chainName]);
    }
  }, [dataChainId]);

  useEffect(() => {
    if (chainId && chainId !== dataChainId) {
      setDataChainId(chainId);
    }
  }, [chainId]);

  const handleSwitchNetwork = async (_chainId: number) => {
    setDataChainId(_chainId);
    if (account && _chainId !== chainId) {
      try {
        await switchNetwork(_chainId);
      } catch (switchError) {
        try {
          await library?.send("wallet_addEthereumChain", [
            {
              chainId: `0x${_chainId.toString(16)}`,
              chainName: NETWORK_BY_CHAIN_ID[_chainId].chainName,
              nativeCurrency: NATIVE_CURRENCY_BY_CHAIN_ID[_chainId],
              rpcUrls: [RPC_URL_BY_CHAIN_ID[_chainId]],
              blockExplorerUrls: [BLOCK_EXPLORER_URL_BY_CHAIN_ID[_chainId]],
            },
          ]);
        } catch (addError) {
          throw addError;
        }
      }
    }
  };
  return (
    <DAppProvider config={config}>
      <ApolloProvider client={client}>
        <ChakraProvider theme={theme}>
          <App
            dataChainId={dataChainId}
            onSwitchNetwork={handleSwitchNetwork}
          />
        </ChakraProvider>
      </ApolloProvider>
    </DAppProvider>
  );
};

root.render(
  <React.StrictMode>
    <Dapp />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
