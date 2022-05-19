import { Avatar, Flex, Icon, Text, Tooltip } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useContext } from "react";
import { BiCheckCircle } from "react-icons/bi";
import { Localhost, Mainnet, Optimism, Polygon } from "../../config";
import SubgraphContext from "../../context/SubgraphContext";

interface TokenInfoCellProps {
  token: {
    name: string;
    symbol: string;
    id: string;
  };
  whitelisted: boolean;
}
export function TokenInfoCell({ token, whitelisted }: TokenInfoCellProps) {
  const dataChainId = useContext(SubgraphContext);
  const networks = {
    [Mainnet.chainId]: "ethereum",
    [Optimism.chainId]: "optimism",
    [Polygon.chainId]: "polygon",
    [Localhost.chainId]: "ethereum",
  };
  return (
    <Flex align="center">
      <Avatar
        src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${
          networks[dataChainId]
        }/assets/${ethers.utils.getAddress(token.id)}/logo.png`}
        size="sm"
        mr={2}
      />
      <Flex direction="column">
        <Flex align="center">
          <Text fontSize="sm" fontWeight={700}>
            {token.symbol}
          </Text>
          {whitelisted && (
            <Tooltip
              label="Whitelisted by the protocol"
              fontSize="md"
              hasArrow
              placement="top"
            >
              <Flex align="center">
                <Icon as={BiCheckCircle} ml={2} />
              </Flex>
            </Tooltip>
          )}
        </Flex>
        <Text fontSize="xs">{token.name}</Text>
      </Flex>
    </Flex>
  );
}
