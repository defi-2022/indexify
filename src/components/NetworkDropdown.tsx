import {
  Avatar,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";
import {
  Chain,
  Mainnet,
  Mumbai,
  Optimism,
  OptimismKovan,
  Polygon,
  useEthers,
} from "@usedapp/core";
import React from "react";
import { BiChevronDown } from "react-icons/bi";
import EthereumLogo from "../img/ethereum.svg";
import OptimismLogo from "../img/optimism.svg";
import OptimismKovanLogo from "../img/optimism-kovan.svg";
import PolygonLogo from "../img/polygon.png";
import MumbaiLogo from "../img/polygon-mumbai.png";
import { NETWORK_BY_CHAIN_ID } from "../lib/constants";

interface NetworkDropdownProps {
  onChange: (network: number) => void;
  dataChainId: number;
}

const NetworkDropdown = ({ onChange, dataChainId }: NetworkDropdownProps) => {
  const { chainId, account } = useEthers();
  const chains: Chain[] = [Mainnet, Optimism, OptimismKovan, Polygon, Mumbai];
  const logos = {
    [Mainnet.chainId]: EthereumLogo,
    [Optimism.chainId]: OptimismLogo,
    [OptimismKovan.chainId]: OptimismKovanLogo,
    [Polygon.chainId]: PolygonLogo,
    [Mumbai.chainId]: MumbaiLogo,
  };

  const selectedChainId = account && chainId ? chainId : dataChainId;
  return (
    <Menu flip>
      <MenuButton
        as={Button}
        rightIcon={<BiChevronDown />}
        display="flex"
        mr={2}
      >
        <Flex alignItems="center">
          <Avatar src={logos[selectedChainId]} h="28px" w="28px" mr={2} />
          <span>
            {NETWORK_BY_CHAIN_ID[selectedChainId].chainName === "Mainnet"
              ? "Ethereum"
              : NETWORK_BY_CHAIN_ID[selectedChainId].chainName}
          </span>
        </Flex>
      </MenuButton>
      <MenuList p={2} borderRadius="12px">
        {chains.map((chain: Chain, i: number) => {
          return (
            <Button
              key={chain.chainId}
              onClick={() => {
                onChange(chain.chainId);
              }}
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              mb={i === chains.length - 1 ? 0 : 2}
              px="10px"
              py="5px"
            >
              <Avatar
                src={logos[chain.chainId]}
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
// const NetworkDropdown = ({ onChange, dataChainId }: NetworkDropdownProps) => {
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
//                     onChange(chain.chainId);
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
