import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  SimpleGrid,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import { useGasPrice, useNetwork } from "@usedapp/core";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";
import Card from "../../../components/Card";
import DonutChart from "../../../components/charts/DonutChart";
import TxStatus from "../../../components/TxStatus";
import { TokenInfoCell } from "../../../components/table/TokenInfoCell";
import { useCreateIndex, useCurrentNetwork, usePoolData } from "../../../hooks";
interface ReviewProps {
  activeStep?: number;
  nextStep: () => void;
  prevStep?: () => void;
  reset?: () => void;
  stepsLength?: number;
  name: string;
  symbol: string;
  onSubmit: (poolIds: string[]) => void;
  selectedPools: string[];
  selectedWeights: number[];
}

const useCreateIndexArgs = (
  name: string,
  symbol: string,
  selectedPools: any[],
  selectedWeights: number[],
  managementFee: number
) => {
  const { pools, poolsLoading } = usePoolData();

  if (poolsLoading) {
    return [];
  }
  const composition = selectedPools.map((poolId: string) => {
    const pool = pools.find((pool: any) => pool.id === poolId);
    const token = pool.token0 || pool.token1;
    return token.id;
  });

  const fees = selectedPools.map((poolId: string) => {
    const pool = pools.find((pool: any) => pool.id === poolId);
    return pool.feeTier;
  });

  return [
    name,
    symbol,
    composition,
    selectedWeights.map((weight: number) => weight * 100), // percentage to bps
    fees,
    managementFee,
  ];
};

const format = (val: number) => `%` + Math.round(val / 100);
const parse = (val: string) => Number(val.replace(/^\%/, "")) * 100;

export default function Review({
  name,
  symbol,
  selectedPools,
  selectedWeights,
  prevStep,
  reset,
}: ReviewProps) {
  const { network } = useNetwork();
  const gasPrice = useGasPrice();
  const CurrentNetwork = useCurrentNetwork();
  const { pools, poolsLoading } = usePoolData();
  const { createIndexState, createIndex, indexAddress, contract } =
    useCreateIndex();

  const [managementFee, setManagementFee] = useState(100);
  const [estimatedGas, setEstimatedGas] = useState(BigNumber.from(0));
  const createIndexArgs = useCreateIndexArgs(
    name,
    symbol,
    selectedPools,
    selectedWeights,
    managementFee
  );

  const handleCreateIndex = async () => {
    await createIndex(...createIndexArgs);
  };

  const estimateGas = async () => {
    const gas = await contract
      // @ts-ignore
      .connect(network.provider)
      .estimateGas.createIndex(...createIndexArgs);
    setEstimatedGas(gas);
  };

  useEffect(() => {
    estimateGas();
  }, []);

  if (poolsLoading) {
    return <div>Loading...</div>;
  }

  const poolsToDict = pools.reduce((acc: any, pool: any) => {
    acc[pool.id] = pool;
    return acc;
  }, {});
  const chartData = pools
    ? selectedPools
        .map((poolId) => poolsToDict[poolId])
        .map((pool: any) => ({
          name: (pool.token0 || pool.token1).symbol,
          value: selectedWeights[selectedPools.indexOf(pool.id)],
        }))
    : [];

  return (
    <>
      <Heading size="xl" w="100%" textAlign="left" mb={10}>
        Review
      </Heading>
      <Heading size={"lg"}>${symbol}</Heading>
      <Text fontSize="lg">{name}</Text>
      <Text>
        Creating a fund will deploy an index contract with the following
        composition and weights{" "}
      </Text>
      <Text>
        Please confirm that the composition and weights are correct before
        deploying the contract
      </Text>
      <Card my={10}>
        <Heading size="md" letterSpacing={0}>
          Fees
        </Heading>
        <Text>
          Fees are deducted from each investment in the fund. There are no fees
          to redeem the fund token and get the collateral on the vaults (except
          the network gas fees){" "}
        </Text>
      </Card>
      <Card>
        <SimpleGrid columns={{ lg: 2, md: 1 }} spacing={10}>
          <Stat>
            <StatLabel>Management Fees</StatLabel>
            <StatNumber display={"flex"} alignItems="center">
              <span>{(managementFee / 100).toFixed(2)}%</span>
              <IconButton
                size="xs"
                aria-label="increment"
                colorScheme="blue"
                icon={<BiPlus />}
                ml={2}
                onClick={() => setManagementFee(managementFee + 5)}
                disabled={managementFee === 1000}
              ></IconButton>
              <IconButton
                size="xs"
                aria-label="decrement"
                colorScheme="blue"
                icon={<BiMinus />}
                onClick={() => setManagementFee(managementFee - 5)}
                ml={1}
                disabled={managementFee === 0}
              ></IconButton>
            </StatNumber>
            <StatHelpText display={"flex"} alignItems="center">
              <Badge mr={2}>Beta Version</Badge> Cannot be modified later
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Protocol Fee</StatLabel>
            <StatNumber>1.00%</StatNumber>
            <StatHelpText>Set by the protocol</StatHelpText>
          </Stat>
        </SimpleGrid>
      </Card>
      <SimpleGrid columns={{ lg: 2, md: 1 }} spacing={10} minH={300} mt={10}>
        <Card>
          <Heading size="md" letterSpacing={0} mb={4}>
            Composition
          </Heading>
          {selectedPools.map((poolId: string) => {
            const pool = poolsToDict[poolId];
            const token = pool.token0 || pool.token1;
            return (
              <Box mb={4} key={pool.id}>
                <TokenInfoCell token={token} whitelisted={false} showAddress />
              </Box>
            );
          })}
        </Card>
        <Box>
          <Heading size="md" letterSpacing={0} mb={4}>
            Weights
          </Heading>
          <DonutChart data={chartData} chartName={symbol} />
        </Box>
      </SimpleGrid>
      <Card my={10}>
        <Heading size="md" letterSpacing={0} mb={4}>
          Deployment details
        </Heading>
        <Text fontSize={"sm"}>
          <b>Protocol Deployer:</b>{" "}
          <Link
            color="blue.500"
            target="_blank"
            href={CurrentNetwork.getExplorerAddressLink(
              CurrentNetwork.indexDeployerAddress!
            )}
          >
            {CurrentNetwork.indexDeployerAddress}
          </Link>
        </Text>
        <Text>
          <b>Estimated Gas Cost:</b>{" "}
          {gasPrice && ethers.utils.formatEther(estimatedGas.mul(gasPrice))}
        </Text>
        <Text>
          <b>Gas Price:</b> {gasPrice && ethers.utils.formatEther(gasPrice)}
        </Text>
      </Card>
      <TxStatus
        status={createIndexState.status}
        receipt={createIndexState.receipt}
      />
      <Flex justify="flex-end" mt={4}>
        <Button
          variant="ghost"
          onClick={reset}
          mr={4}
          isDisabled={
            createIndexState.status === "Mining" ||
            createIndexState.status === "PendingSignature"
          }
        >
          Cancel
        </Button>
        <Button
          variant="gradient"
          onClick={handleCreateIndex}
          mr={4}
          isDisabled={
            createIndexState.status === "Mining" ||
            createIndexState.status === "PendingSignature"
          }
        >
          Confirm
        </Button>
      </Flex>
    </>
  );
}
