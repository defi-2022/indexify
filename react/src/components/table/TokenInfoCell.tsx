import { Avatar, Flex, Icon, Link, Text, Tooltip } from "@chakra-ui/react";
import { BiCheckCircle } from "react-icons/bi";
import { useCurrentNetwork } from "../../hooks";

interface TokenInfoCellProps {
  token: {
    name: string;
    symbol: string;
    id: string;
  };
  whitelisted: boolean;
  showAddress?: boolean;
}
export function TokenInfoCell({
  token,
  whitelisted,
  showAddress = false,
}: TokenInfoCellProps) {
  const CurrentNetwork = useCurrentNetwork();

  return (
    <Flex align="center">
      <Avatar src={CurrentNetwork.getTokenLogo(token.id)} size="sm" mr={2} />
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
        {showAddress && (
          <Link
            fontSize="xs"
            color="blue.500"
            target="_blank"
            href={CurrentNetwork.getExplorerAddressLink(token.id)}
          >
            {token.id}
          </Link>
        )}
      </Flex>
    </Flex>
  );
}
