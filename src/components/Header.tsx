import {
  Flex,
  Heading,
  IconButton,
  useColorMode,
  Container,
  chakra,
} from "@chakra-ui/react";
import { BiDotsHorizontalRounded, BiMoon, BiSun } from "react-icons/bi";
import NetworkDropdown from "./NetworkDropdown";
import WalletButton from "./WalletButton";

interface HeaderProps {
  onSwitchNetwork: (network: number) => void;
  dataChainId: number;
}

const Header = ({ onSwitchNetwork, dataChainId }: HeaderProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <chakra.header boxShadow="xs">
      <Container maxW="8xl">
        <Flex py={2} justify="space-between" align="center">
          <Heading size={"2xl"}>indexify.xyz</Heading>
          <Flex justify="space-between" align="center">
            <NetworkDropdown
              onChange={onSwitchNetwork}
              dataChainId={dataChainId}
            />
            <WalletButton />
            <IconButton
              mr={2}
              aria-label="More options"
              icon={
                colorMode === "light" ? (
                  <BiMoon size={20} fill="currentColor" />
                ) : (
                  <BiSun size={20} fill="currentColor" />
                )
              }
              onClick={toggleColorMode}
            />
            <IconButton
              aria-label="More options"
              icon={<BiDotsHorizontalRounded size={20} fill="currentColor" />}
            />
          </Flex>
        </Flex>
      </Container>
    </chakra.header>
  );
};

export default Header;
