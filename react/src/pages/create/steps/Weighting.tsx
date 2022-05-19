import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  Tooltip,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Avatar,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { BiCheckCircle } from "react-icons/bi";
import DonutChart from "../../../components/charts/DonutChart";
import Table from "../../../components/table/Table";
import SubgraphContext from "../../../context/SubgraphContext";
import { usePoolData } from "../../../hooks";
import { ethers } from "ethers";
import { Mainnet, Optimism, Polygon, Localhost } from "../../../config";
import { TokenInfoCell } from "../../../components/table/TokenInfoCell";

interface WeightingProps {
  activeStep?: number;
  nextStep: () => void;
  prevStep?: () => void;
  reset?: () => void;
  stepsLength?: number;
  name: string;
  symbol: string;
  onSubmit: (weights: number[]) => void;
  selectedPools: string[];
}

const networks = {
  [Mainnet.chainId]: "ethereum",
  [Optimism.chainId]: "optimism",
  [Polygon.chainId]: "polygon",
  [Localhost.chainId]: "ethereum",
};

export default function Weighting({
  name,
  symbol,
  selectedPools,
  nextStep,
  onSubmit,
  prevStep,
}: WeightingProps) {
  const toast = useToast();
  const dataChainId = useContext(SubgraphContext);
  const { pools, whitelistedPoolsIds } = usePoolData();
  const [weights, setWeights] = useState<number[]>(
    selectedPools.map(() => 100 / selectedPools.length)
  );

  const poolsToDict = pools.reduce((acc: any, pool: any) => {
    acc[pool.id] = pool;
    return acc;
  }, {});
  const chartData = selectedPools
    .map((poolId) => poolsToDict[poolId])
    .map((pool: any) => ({
      name: (pool.token0 || pool.token1).symbol,
      value: weights[selectedPools.indexOf(pool.id)],
    }));

  const tableData = selectedPools.map((poolId) => {
    const pool = poolsToDict[poolId];
    const token = pool.token0 || pool.token1;
    return {
      asset: (
        <TokenInfoCell
          token={token}
          whitelisted={whitelistedPoolsIds.includes(pool.id)}
        />
      ),
      weight: (
        <NumberInput
          precision={2}
          step={0.2}
          onChange={(valueAsString: string, valueAsNumber: number) => {
            const newWeights = [...weights];
            newWeights[selectedPools.indexOf(poolId)] = valueAsNumber;
            setWeights(newWeights);
          }}
          value={weights[selectedPools.indexOf(poolId)]}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      ),
    };
  });

  const sumOfWeights = weights.reduce((acc, weight) => acc + weight, 0);

  const handleSubmit = () => {
    if (sumOfWeights !== 100) {
      toast({
        title: "Weights must sum to 100%",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      onSubmit(weights);
      nextStep();
    }
  };

  return (
    <>
      <Heading size="xl" w="100%" textAlign="left" mb={10}>
        Weighting
      </Heading>
      <Text fontWeight={400} mb={2} display="flex" alignItems="center">
        Select the weight that each asset will represent in the fund.
      </Text>
      <Text fontWeight={400} mb={2} display="flex" alignItems="center">
        The percentage choosen will mean that for each ETH invested in the fund,
        the amount of ETH will be distributed to each pool in proportion to the
        weight.
      </Text>
      <Alert status="info" borderRadius={12} fontSize="sm" my={4}>
        <AlertIcon />
        Since assets prices change over time, there might be a deviation
        eventually from the original weights. But as ETH is invested over time,
        the deviation will be small and will tend to zero. Meaning that it will
        tend to match the original weights. In future iterations of the Indexify
        protocol, we will be able to adjust the weights to match the actual
        prices of the assets automatically.
      </Alert>
      <Alert
        status={sumOfWeights !== 100 ? "error" : "info"}
        borderRadius={12}
        fontSize="sm"
        mb={4}
      >
        <AlertIcon />
        The sum of all weights must be 100%
        {sumOfWeights !== 100 && (
          <Text ml={1} fontWeight={700}>
            (currently: {sumOfWeights}%)
          </Text>
        )}
      </Alert>
      <SimpleGrid columns={2} spacing={10} minH={300} mb={4}>
        <Box>
          <Table
            columns={[
              {
                Header: "Asset",
                accessor: "asset",
              },
              {
                Header: "Weight",
                accessor: "weight",
              },
            ]}
            data={tableData}
            pagination={false}
          ></Table>
        </Box>
        <DonutChart data={chartData} chartName={`$${symbol}`} />
      </SimpleGrid>
      <Flex justify="flex-end">
        <Button onClick={prevStep} mr={4} variant="ghost">
          Prev
        </Button>
        <Button variant="gradient" onClick={handleSubmit} type="submit">
          Next
        </Button>
      </Flex>
    </>
  );
}
