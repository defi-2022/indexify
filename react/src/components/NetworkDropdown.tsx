import {
  Avatar,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import React from "react";
import { BiChevronDown } from "react-icons/bi";
import {
  ENABLED_NETWORKS,
  ExtendedChain,
  NETWORK_BY_CHAIN_ID,
} from "../config";
import { isChainIdSupported } from "../lib/network";

const SelectedNetwork = ({ chainId }: { chainId: number }) => {
  if (!isChainIdSupported(chainId)) {
    return <>Not Supported</>;
  }
  const network = NETWORK_BY_CHAIN_ID[chainId];
  return (
    <Flex alignItems="center">
      <Avatar src={network.logo} h="28px" w="28px" mr={2} />
      <span>
        {network.chainName === "Mainnet" ? "Ethereum" : network.chainName}
      </span>
    </Flex>
  );
};

interface NetworkDropdownProps {
  onSelectNetwork: (network: number) => void;
  dataChainId: number;
}

const NetworkDropdown = ({
  onSelectNetwork,
  dataChainId,
}: NetworkDropdownProps) => {
  const { chainId, account } = useEthers();

  const selectedChainId = account && chainId ? chainId : dataChainId;
  return (
    <Menu flip>
      <MenuButton
        as={Button}
        rightIcon={<BiChevronDown />}
        display="flex"
        mr={2}
      >
        <SelectedNetwork chainId={selectedChainId} />
      </MenuButton>
      <MenuList p={2} borderRadius="12px">
        {ENABLED_NETWORKS.map((chain: ExtendedChain, i: number) => {
          return (
            <Button
              key={chain.chainId}
              onClick={() => {
                onSelectNetwork(chain.chainId);
              }}
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              mb={i === ENABLED_NETWORKS.length - 1 ? 0 : 2}
              px="10px"
              py="5px"
            >
              <Avatar
                src={NETWORK_BY_CHAIN_ID[chain.chainId].logo}
                h="28px"
                w="28px"
                css={{ marginRight: "1em" }}
              />
              <div>
                {chain.chainName === "Mainnet" ? "Ethereum" : chain.chainName}
              </div>
              {chainId === chain.chainId && account && (
                <div
                  style={{
                    backgroundColor: "#17c964",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    marginRight: "auto",
                    position: "absolute",
                    right: 15,
                  }}
                ></div>
              )}
            </Button>
          );
        })}
      </MenuList>
    </Menu>
  );
};
// const NetworkDropdown = ({ onSelectNetwork, dataChainId }: NetworkDropdownProps) => {
// const { chainId, account } = useEthers();
// const chains: Chain[] = [Mainnet, Optimism, Polygon];
// const logos = {
//   [Mainnet.chainId]: EthereumLogo,
//   [Optimism.chainId]: OptimismLogo,
//   [Polygon.chainId]: PolygonLogo,
// };

// const selectedChainId = account && chainId ? chainId : dataChainId;
//   return (
//     <>
//       <Tooltip
//         trigger="click"
//         color="secondary"
//         hideArrow
//         css={{ padding: "0" }}
//         content={
//           <Box shadow={false}>
//             {chains.map((chain: Chain) => {
//               return (
//                 <Button
//                   key={chain.chainId}
//                   onClick={() => {
//                     onSelectNetwork(chain.chainId);
//                   }}
//                   css={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     backgroundColor:
//                       selectedChainId === chain.chainId
//                         ? "#333333"
//                         : "transparent",
//                     marginBottom: "0.5rem",
//                     padding: "5px 10px",
//                     marginLeft: -10,
//                     marginRight: -10,
//                   }}
//                 >
//                   <Avatar
//                     src={logos[chain.chainId]}
//                     size="sm"
//                     css={{ marginRight: "1em" }}
//                   />
//                   <div>
//                     {chain.chainName === "Mainnet"
//                       ? "Ethereum"
//                       : chain.chainName}
//                   </div>
//                   {chainId === chain.chainId && account && (
//                     <div
//                       style={{
//                         backgroundColor: "#17c964",
//                         width: 8,
//                         height: 8,
//                         borderRadius: "50%",
//                         marginRight: "auto",
//                         position: "absolute",
//                         right: 15,
//                       }}
//                     ></div>
//                   )}
//                 </Button>
//               );
//             })}
//           </Box>
//         }
//         placement="bottomEnd"
//       >
//         <Button
//           css={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             mw: "400px",
//             padding: "5px 10px",
//           }}
//           auto
//           flat
//           iconRight={<BiChevronDown size="20px" />}
//         >
// <Avatar
//   src={logos[selectedChainId]}
//   size="sm"
//   css={{ marginRight: "1em" }}
// />
//           <span>
// {NETWORK_BY_CHAIN_ID[selectedChainId].chainName === "Mainnet"
//   ? "Ethereum"
//   : NETWORK_BY_CHAIN_ID[selectedChainId].chainName}
//           </span>
//         </Button>
//       </Tooltip>
//     </>
//   );
// };

export default NetworkDropdown;
