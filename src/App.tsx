import { useQuery } from "@apollo/client";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { GET_AVAILABLE_TOKENS, GET_WHITELISTED_POOLS } from "./graphql/queries";
import { getAvailablePools, getWhitelistedPools } from "./graphql/utils";
import { NETWORK_BY_CHAIN_ID, NETWORK_CURRENCIES } from "./lib/constants";
import Create from "./pages/create";
import Dashboard from "./pages/dashboard";
import Invest from "./pages/invest";
import Landing from "./pages/landing";
import { Flex } from "@chakra-ui/react";
interface AppProps {
  dataChainId: number;
  onSwitchNetwork: (chainId: number) => void;
}

const App = ({ dataChainId, onSwitchNetwork }: AppProps) => {
  const currentNetworkData = NETWORK_BY_CHAIN_ID[dataChainId].chainName;

  const { data: pools } = getAvailablePools(
    useQuery(GET_AVAILABLE_TOKENS(NETWORK_CURRENCIES[currentNetworkData]))
  );

  const { data: whitelistedPoolsIds } = getWhitelistedPools(
    useQuery(GET_WHITELISTED_POOLS(NETWORK_CURRENCIES[currentNetworkData]))
  );

  return (
    <Flex direction="column" h="100%">
      <Header onSwitchNetwork={onSwitchNetwork} dataChainId={dataChainId} />
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
