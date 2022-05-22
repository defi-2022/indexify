import { Flex } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { Polygon } from "./config";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorMessage from "./components/ErrorMessage";
import Header from "./components/Header";
import { isChainIdSupported } from "./lib/network";
import Create from "./pages/create";
import Dashboard from "./pages/dashboard";
import Invest from "./pages/invest";
import Landing from "./pages/landing";
import Details from "./pages/details";
interface AppProps {
  onSelectNetwork: (chainId: number) => void;
}

const App = ({ onSelectNetwork }: AppProps) => {
  const { chainId } = useEthers();
  const showMessage = !isChainIdSupported(chainId || Polygon.chainId);
  return (
    <Flex direction="column" h="100%">
      <ErrorMessage
        show={showMessage}
        title="Current network is not supported!"
        description="Please change to a supported network."
      />
      <BrowserRouter>
        <Header onSelectNetwork={onSelectNetwork} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="funds/create" element={<Create />} />
          <Route path="funds/:address" element={<Details />} />
          <Route path="invest" element={<Invest />} />
        </Routes>
      </BrowserRouter>
    </Flex>
  );
};

export default App;
