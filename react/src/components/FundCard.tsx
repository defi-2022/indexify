import {
  Heading,
  Text,
  Link,
  Box,
  Badge,
  Flex,
  Avatar,
  AvatarGroup,
  Spinner,
  Button,
  Stack,
  SimpleGrid,
} from "@chakra-ui/react";
import { useGasPrice, useNetwork, useEthers } from "@usedapp/core";
import { useState, useEffect } from "react";
import {
  useBalanceOf,
  useCurrentNetwork,
  useIndexContract,
  usePoolData,
  useTotalSupply,
} from "../hooks";
import Card from "./Card";
import DonutChart from "./charts/DonutChart";
import InvestBox from "./InvestBox";
import { ethers, BigNumber } from "ethers";
import { useContractFunction } from "@usedapp/core";
import TxStatus from "./TxStatus";
interface FundCardProps {
  fund: any[];
  onDetailsClick: (fund: any[]) => void;
}

const FundCard = ({
  fund: [
    address,
    name,
    symbol,
    composition,
    weights,
    poolFees,
    managerFee,
    nativeCurrency,
    protocolFee,
    protocolAddress,
    manager,
  ],
  onDetailsClick,
}: FundCardProps) => {
  const { account: userAddress } = useEthers();
  const { network } = useNetwork();
  const [vault, setVault] = useState<BigNumber[]>([]);

  const contract = useIndexContract(address);
  const balance = useBalanceOf(address, userAddress!);
  const totalSupply = useTotalSupply(address);
  const gasPrice = useGasPrice();
  const { state: buyState, send: buy } = useContractFunction(contract, "buy", {
    transactionName: `Buy ${symbol}`,
  });

  const [isInvesting, setIsInvesting] = useState(false);
  const { tokensLoading, tokens } = usePoolData();
  const CurrentNetwork = useCurrentNetwork();
  const fund = [
    address,
    name,
    symbol,
    composition,
    weights,
    poolFees,
    managerFee,
    nativeCurrency,
    protocolFee,
    protocolAddress,
    manager,
  ];

  const getVaultSnapshot = async () => {
    const events = await contract.connect(network.provider!).queryFilter(
      //@ts-ignore
      "*",
      CurrentNetwork.indexDeployerBlockNumber,
      "latest"
    );
    const vault = events.filter(
      (e: any) => e.event === "Invested" || e.event === "Redeemed"
    );
    const latest = vault[vault.length - 1];
    if (latest) {
      setVault(latest?.args?.newTotalsInVault);
    }
  };

  useEffect(() => {
    if (network.provider) {
      getVaultSnapshot();
    }
  }, [network]);

  const chartData =
    Object.keys(tokens).length > 0
      ? composition
          .map((tokenId: string) => tokens[tokenId.toLowerCase()])
          .map((token: any, i: number) => ({
            name: token.symbol,
            value: weights[i].toNumber() / 100,
          }))
      : [];

  const handleSubmitInvestment = async ({ amount }: { amount: string }) => {
    buy({
      value: ethers.utils.parseEther(amount),
      gasLimit: 1000000,
      gasPrice,
    });
  };
  return (
    <Card bg="none" shadow="xs">
      <Flex justify="space-between" align="center">
        <Heading size="lg" letterSpacing={-0.5}>
          ${symbol}
        </Heading>
        <AvatarGroup>
          {composition.map((tokenId: string) => (
            <Avatar
              key={tokenId}
              src={CurrentNetwork.getTokenLogo(tokenId)}
              size="sm"
              mr={2}
            />
          ))}
        </AvatarGroup>
      </Flex>
      <Text my={2}>{name}</Text>
      <Text fontSize="xs">
        Contract Address:{" "}
        <Link
          href={`${CurrentNetwork.getExplorerAddressLink(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          color="blue.500"
        >
          {address}
        </Link>
      </Text>
      <Text fontSize="xs">
        Manager Address:{" "}
        <Link
          href={`${CurrentNetwork.getExplorerAddressLink(manager)}`}
          target="_blank"
          rel="noopener noreferrer"
          color="blue.500"
        >
          {manager}
        </Link>
      </Text>
      <SimpleGrid columns={{ sm: 1, lg: 2 }} spacing={4} my={4}>
        <Flex direction="column">
          <Box>
            <Badge colorScheme="blue" mr={2}>
              Protocol Fee
            </Badge>
            <Badge>{protocolFee.toNumber() / 100}%</Badge>
          </Box>
          <Box>
            <Badge colorScheme="blue" mr={2}>
              Manager Fee
            </Badge>
            <Badge>{managerFee.toNumber() / 100}%</Badge>
          </Box>
        </Flex>
        <Box>
          <Box>
            <Badge colorScheme="blue" mr={2}>
              User Balance
            </Badge>
            <Badge>
              {balance ? ethers.utils.formatEther(balance?.toString()) : 0}{" "}
              Tokens
            </Badge>
          </Box>
          <Box>
            <Badge colorScheme="blue" mr={2}>
              Total Supply
            </Badge>
            <Badge>
              {totalSupply
                ? ethers.utils.formatEther(totalSupply?.toString())
                : 0}{" "}
              Tokens
            </Badge>
          </Box>
        </Box>
      </SimpleGrid>
      {isInvesting ? (
        <Flex h={300} justifyContent="center" direction="column">
          <InvestBox
            onSubmit={handleSubmitInvestment}
            onCancel={() => setIsInvesting(false)}
          />
          <TxStatus status={buyState.status} />
        </Flex>
      ) : (
        <Flex h={300}>
          <DonutChart data={chartData} chartName={symbol} />
        </Flex>
      )}

      <Flex justify="flex-end">{tokensLoading && <Spinner size="sm" />}</Flex>
      <Stack direction="row" spacing={4} mt={10}>
        {!isInvesting && (
          <Button
            variant={isInvesting ? "solid" : "gradient"}
            colorScheme={isInvesting ? "red" : undefined}
            w="100%"
            onClick={() => setIsInvesting(!isInvesting)}
          >
            {isInvesting ? "Cancel" : `Invest`}
          </Button>
        )}
        <Button variant="outline" w="100%" onClick={() => onDetailsClick(fund)}>
          Details
        </Button>
      </Stack>
    </Card>
  );
};

export default FundCard;
