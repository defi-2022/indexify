import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  Link,
  SimpleGrid,
  Spinner,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import {
  useContractFunction,
  useEthers,
  useGasPrice,
  useNetwork,
} from "@usedapp/core";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../../components/Card";
import RedeemBox from "../../components/RedeemBox";
import TxStatus from "../../components/TxStatus";
import {
  useBalanceOf,
  useCurrentNetwork,
  useDeployerContract,
  useEvents,
  useIndexContract,
  usePoolData,
  useTotalSupply,
} from "../../hooks";

interface DetailsProps {}

const Details = () => {
  const { address } = useParams();
  const { account: userAddress } = useEthers();
  const { network } = useNetwork();
  const [vault, setVault] = useState<BigNumber[]>([]);
  const [fund, setFund] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const contract = useIndexContract(address!);
  const deployerContract = useDeployerContract();
  const balance = useBalanceOf(address, userAddress!);
  const totalSupply = useTotalSupply(address);
  const gasPrice = useGasPrice();

  const [isInvesting, setIsInvesting] = useState(false);
  const { tokensLoading, tokens } = usePoolData();
  const CurrentNetwork = useCurrentNetwork();
  const contractEvents = useEvents("*", contract);
  const factoryEvents = useEvents(
    "LogDeployedIndexContract",
    deployerContract,
    { shouldQueryOnce: true }
  );
  useEffect(() => {
    if (contractEvents.length > 0 && contractEvents.length > allEvents.length) {
      setAllEvents(contractEvents);
      const vault = contractEvents.filter(
        (e: any) => e.event === "Invested" || e.event === "Redeemed"
      );
      const latest = vault[vault.length - 1];
      if (latest) {
        setVault(latest?.args?.newTotalsInVault);
      }
    }
  }, [contractEvents]);

  useEffect(() => {
    if (factoryEvents.length > 0) {
      const event = factoryEvents.find((e) => e?.args?.[0] === address);
      if (event && fund.length === 0) {
        setFund((event?.args as any[]) || []);
      }
    }
  }, [factoryEvents]);

  const [
    address2,
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
  ] = fund;

  const { state: redeemState, send: redeem } = useContractFunction(
    contract,
    "redeem",
    {
      transactionName: `Redeem ${symbol}`,
    }
  );

  // sort reverse all events by blocknumber
  const sortedEvents = allEvents.sort((a, b) => {
    return b.blockNumber - a.blockNumber;
  });

  const handleRedeemTokens = async ({ amount }: { amount: string }) => {
    const value = ethers.utils.parseEther(String(amount)).toString();
    await redeem(value, {
      gasLimit: 1000000,
    });
  };

  if (fund.length === 0) {
    return (
      <Container maxW="8xl" pb={10}>
        {!userAddress && (
          <Alert status="warning" mb={4} mt={4} borderRadius={12}>
            <AlertIcon />
            <AlertTitle mr={2}>
              You need to connect your wallet to interact with available funds
            </AlertTitle>
          </Alert>
        )}
        <Spinner mt={4} />
      </Container>
    );
  }

  return (
    <Container maxW="8xl" pb={10}>
      <Flex justify="space-between" align="center" mt={10}>
        <Heading letterSpacing={-0.5}>${symbol}</Heading>
        <AvatarGroup>
          {composition.map((tokenId: string) => (
            <Avatar
              key={tokenId}
              src={CurrentNetwork.getTokenLogo(tokenId)}
              size="md"
              mr={2}
            />
          ))}
        </AvatarGroup>
      </Flex>

      <Text fontSize="lg" mb={10}>
        {name}
      </Text>
      <Text fontSize="sm">
        Contract Address:{" "}
        <Link
          href={`${CurrentNetwork.getExplorerAddressLink(address!)}`}
          target="_blank"
          rel="noopener noreferrer"
          color="blue.500"
        >
          {address}
        </Link>
      </Text>
      <Text fontSize="sm">
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
      <SimpleGrid columns={{ sm: 1, lg: 4 }} spacing={4} my={4}>
        <Box>
          <Badge fontSize="sm" colorScheme="blue" mr={2}>
            Protocol Fee
          </Badge>
          <Badge fontSize="sm">{protocolFee.toNumber() / 100}%</Badge>
        </Box>
        <Box>
          <Badge fontSize="sm" colorScheme="blue" mr={2}>
            Manager Fee
          </Badge>
          <Badge fontSize="sm">{managerFee.toNumber() / 100}%</Badge>
        </Box>

        <Box>
          <Badge fontSize="sm" colorScheme="blue" mr={2}>
            User Balance
          </Badge>
          <Badge fontSize="sm">
            {balance ? ethers.utils.formatEther(balance?.toString()) : 0} Tokens
          </Badge>
        </Box>
        <Box>
          <Badge fontSize="sm" colorScheme="blue" mr={2}>
            Total Supply
          </Badge>
          <Badge fontSize="sm">
            {totalSupply
              ? ethers.utils.formatEther(totalSupply?.toString())
              : 0}{" "}
            Tokens
          </Badge>
        </Box>
      </SimpleGrid>
      {!!userAddress && (
        <>
          <RedeemBox
            onSubmit={handleRedeemTokens}
            symbol={symbol}
            balance={balance}
          />
          <Text mb={4}>
            Redeeming lets you burn your tokens and get the portion of
            collateral from the vault that belongs to you in your wallet
          </Text>
          <TxStatus status={redeemState.status} />
        </>
      )}
      <Divider my={10} />
      <Heading mb={2}>${symbol} fund vault holdings</Heading>
      <Flex align={"center"}>
        <Badge mr={1}>Beta Notice</Badge>{" "}
        <Text fontSize="sm">no decimal formatting</Text>
      </Flex>
      <SimpleGrid columns={{ sm: 1, lg: 4 }} spacing={4} my={4}>
        {composition.map((tokenId: string, i: number) => (
          <Flex key={tokenId} align="center" mb={2}>
            <Avatar src={CurrentNetwork.getTokenLogo(tokenId)} mr={2} />{" "}
            <Text fontSize="2xl">{vault[i]?.toString()}</Text>
          </Flex>
        ))}
      </SimpleGrid>
      <Divider my={10} />
      <Heading mb={2}>${symbol} events</Heading>
      {sortedEvents.map((event: any) => {
        return (
          <Box key={event.transactionHash + event.event}>
            <Card mb={4}>
              <Text fontSize="xl">{event.event}</Text>
              <Link
                fontSize="sm"
                href={CurrentNetwork.getExplorerTransactionLink(
                  event.transactionHash
                )}
                target="_blank"
                color="blue.500"
              >
                {event.transactionHash}
              </Link>
              {event.event === "Invested" || event.event === "Redeemed" ? (
                <Box mt={4}>
                  <Text mb={2} fontWeight="bold">
                    Vault Updated:
                  </Text>
                  {composition.map((tokenId: string, i: number) => (
                    <Flex key={tokenId} align="center" mb={2}>
                      <Avatar
                        src={CurrentNetwork.getTokenLogo(tokenId)}
                        mr={2}
                        size="xs"
                      />{" "}
                      <Text>{event.args.newTotalsInVault[i].toString()}</Text>
                    </Flex>
                  ))}
                </Box>
              ) : null}
            </Card>
          </Box>
        );
      })}
      <Flex justify="flex-end">{tokensLoading && <Spinner size="sm" />}</Flex>
    </Container>
  );
};

export default Details;
