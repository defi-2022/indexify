import { Flex } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { Mainnet } from "./config";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorMessage from "./components/ErrorMessage";
import Header from "./components/Header";
import { isChainIdSupported } from "./lib/network";
import Create from "./pages/create";
import Dashboard from "./pages/dashboard";
import Invest from "./pages/invest";
import Landing from "./pages/landing";
interface AppProps {
  dataChainId: number;
  onSelectNetwork: (chainId: number) => void;
}

const App = ({ dataChainId, onSelectNetwork }: AppProps) => {
  // const currentNetworkData = NETWORK_BY_CHAIN_ID[dataChainId].chainName;

  // const { data: pools } = getAvailablePools(
  //   useQuery(GET_AVAILABLE_TOKENS(NETWORK_CURRENCIES[currentNetworkData]))
  // );

  // const { data: whitelistedPoolsIds } = getWhitelistedPools(
  //   useQuery(GET_WHITELISTED_POOLS(NETWORK_CURRENCIES[currentNetworkData]))
  // );
  const { chainId } = useEthers();
  const showMessage = !isChainIdSupported(chainId || Mainnet.chainId);
  return (
    <Flex direction="column" h="100%">
      <ErrorMessage
        show={showMessage}
        title="Current network is not supported!"
        description="Please change to a supported network."
      />
      <Header onSelectNetwork={onSelectNetwork} dataChainId={dataChainId} />
      <BrowserRouter>
        {/* {pools.map((pool: any) => {
            const token = pool.token0 || pool.token1;
            return (
              <div key={pool.id}>
                {token.name} : {pool.totalValueLockedUSD}{" "}
                {whitelistedPoolsIds.includes(pool.id) ? "WHITELISTED" : "---"}
              </div>
            );
          })} */}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="app" element={<Dashboard />} />
          <Route path="create" element={<Create />} />
          <Route path="invest" element={<Invest />} />
        </Routes>
      </BrowserRouter>
    </Flex>
  );
};

export default App;
