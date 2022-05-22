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
import { useContext } from "react";
import SubgraphContext from "../context/SubgraphContext";
import { useNavigate } from "react-router-dom";
interface HeaderProps {
  onSelectNetwork: (network: number) => void;
}

const Header = ({ onSelectNetwork }: HeaderProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const dataChainId = useContext(SubgraphContext);
  const navigate = useNavigate();
  return (
    <chakra.header boxShadow="xs">
      <Container maxW="8xl">
        <Flex py={2} justify="space-between" align="center">
          <Heading
            size={"2xl"}
            cursor="pointer"
            onClick={() => navigate("dashboard")}
          >
            indexify.xyz
          </Heading>
          <Flex justify="space-between" align="center">
            <NetworkDropdown
              onSelectNetwork={onSelectNetwork}
              dataChainId={dataChainId}
            />
            <WalletButton />
            <IconButton
              // mr={2}
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
            {/* <IconButton
              aria-label="More options"
              icon={<BiDotsHorizontalRounded size={20} fill="currentColor" />}
            /> */}
          </Flex>
        </Flex>
      </Container>
    </chakra.header>
  );
};

export default Header;
