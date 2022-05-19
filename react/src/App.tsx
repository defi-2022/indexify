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
  onSelectNetwork: (chainId: number) => void;
}

const App = ({ onSelectNetwork }: AppProps) => {
  const { chainId } = useEthers();
  const showMessage = !isChainIdSupported(chainId || Mainnet.chainId);
  return (
    <Flex direction="column" h="100%">
      <ErrorMessage
        show={showMessage}
        title="Current network is not supported!"
        description="Please change to a supported network."
      />
      <Header onSelectNetwork={onSelectNetwork} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="app" element={<Dashboard />} />
          <Route path="funds/create" element={<Create />} />
          <Route path="invest" element={<Invest />} />
        </Routes>
      </BrowserRouter>
    </Flex>
  );
};

export default App;
