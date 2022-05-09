import React, { useEffect, useState } from "react";
import {
  useEthers,
  shortenAddress,
  useLookupAddress,
  useEtherBalance,
  Mainnet,
} from "@usedapp/core";
import { Button } from "@chakra-ui/react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { formatEther } from "@ethersproject/units";
import { NETWORK_BY_CHAIN_ID } from "../config";
import { isChainIdSupported } from "../lib/network";

const WalletButton = () => {
  const { account, activate, deactivate, chainId } = useEthers();
  const etherBalance = useEtherBalance(account);
  const ens = useLookupAddress();
  const [activateError, setActivateError] = useState("");
  const { error } = useEthers();

  useEffect(() => {
    if (error) {
      setActivateError(error.message);
    }
  }, [error]);

  const activateProvider = async () => {
    const providerOptions = {
      injected: {
        display: {
          name: "Metamask",
          description: "Connect with the provider in your Browser",
        },
        package: null,
      },
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          bridge: "https://bridge.walletconnect.org",
          infuraId: "d8df2cb7844e4a54ab0a782f608749dd",
        },
      },
    };

    const web3Modal = new Web3Modal({
      providerOptions,
    });
    try {
      const provider = await web3Modal.connect();
      await activate(provider);
      setActivateError("");
    } catch (error: any) {
      setActivateError(error.message);
    }
  };

  if (chainId && !isChainIdSupported(chainId)) {
    return (
      <Button colorScheme="red" mr={2}>
        Not Supported
      </Button>
    );
  }
  return account ? (
    <>
      <Button colorScheme="green" mr={2}>
        {formatEther(etherBalance || 0).substring(0, 7)}{" "}
        {NETWORK_BY_CHAIN_ID[chainId || Mainnet.chainId].currencyInfo.symbol}
      </Button>
      <Button variant="gradient" onClick={() => deactivate()} mr={2}>
        {ens ?? shortenAddress(account)}
      </Button>
    </>
  ) : (
    <Button variant="gradient" onClick={activateProvider} mr={2}>
      Connect Wallet
    </Button>
  );
};

export default WalletButton;
