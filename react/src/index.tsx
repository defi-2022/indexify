import "@fontsource/inter/100.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "./index.css";

import { ChakraProvider } from "@chakra-ui/react";
import { DAppProvider } from "@usedapp/core";
import React from "react";
import { createRoot } from "react-dom/client";

import NetworkLayer from "./NetworkLayer";
import reportWebVitals from "./reportWebVitals";
import theme from "./theme";
import { getUseDappConfig } from "./config";

const container = document.getElementById("root");
const root = createRoot(container!);
const config = getUseDappConfig();

root.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <ChakraProvider theme={theme}>
        <NetworkLayer />
      </ChakraProvider>
    </DAppProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
