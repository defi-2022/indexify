import {
  Alert,
  AlertIcon,
  Avatar,
  Button,
  chakra,
  Checkbox,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { PoolInfoCell } from "../../../components/table/PoolInfoCell";
import Table from "../../../components/table/Table";
import { TokenInfoCell } from "../../../components/table/TokenInfoCell";
import { useCurrentNetwork, usePoolData } from "../../../hooks";
import UniswapLogo from "../../../img/uniswap.svg";
interface StepProps {
  activeStep?: number;
  nextStep: () => void;
  prevStep?: () => void;
  reset?: () => void;
  stepsLength?: number;
  name: string;
  symbol: string;
  onSubmit: (poolIds: string[]) => void;
}

export default function Composition({
  prevStep,
  nextStep,
  name,
  symbol,
  onSubmit,
}: StepProps) {
  const CurrentNetwork = useCurrentNetwork();
  const toast = useToast();
  const { pools, whitelistedPoolsIds } = usePoolData();

  const [search, setSearch] = useState("");
  const [selectedPools, setSelectedPools] = useState<string[]>([]);

  const handleSubmit = () => {
    if (selectedPools.length < 2) {
      toast({
        title: "Please select at least two assets",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      onSubmit(selectedPools);
      nextStep();
    }
  };

  const makeData = (_pools: any = []) => {
    return _pools
      .filter((pool: any) => {
        const token = pool.token0 || pool.token1;
        return (
          token.name.toLowerCase().includes(search.toLowerCase()) ||
          token.symbol.toLowerCase().includes(search.toLowerCase()) ||
          pool.id.toLowerCase().includes(search.toLowerCase()) ||
          token.id.toLowerCase().includes(search.toLowerCase())
        );
      })
      .map((pool: any) => {
        const token = pool.token0 || pool.token1;
        const tokenNumberOpposite = pool.token0 ? 1 : 0;
        return {
          name: (
            <TokenInfoCell
              token={token}
              whitelisted={whitelistedPoolsIds.includes(pool.id)}
            />
          ),
          pool: <PoolInfoCell pool={pool} />,
          price: (
            <>
              <Text fontSize="sm">Ξ {token.derivedETH.substring(0, 10)} </Text>
              <Text fontSize="sm">
                {CurrentNetwork.currencyInfo.symbol}{" "}
                {pool[`token${tokenNumberOpposite}Price`].substring(0, 10)}
              </Text>
            </>
          ),
          protocol: (
            <Flex align="center">
              <Avatar size="sm" src={UniswapLogo} mr={2} />
              <Text size="xs">Uniswap V3</Text>
            </Flex>
          ),
          select: (
            <Flex align="center" justify="flex-start">
              <Checkbox
                isChecked={selectedPools.includes(pool.id as string)}
                onChange={(e) =>
                  setSelectedPools(
                    selectedPools.includes(pool.id as string)
                      ? [...selectedPools].filter(
                          (t) => t !== (pool.id as string)
                        )
                      : [...selectedPools, pool.id as string]
                  )
                }
              ></Checkbox>
            </Flex>
          ),
        };
      });
  };
  const tableData = makeData(pools);
  return (
    <>
      <Heading size="xl" w="100%" textAlign="left">
        {`$${symbol} Composition`}
      </Heading>
      <Text mb={10} fontSize="2xl">
        {name}
      </Text>
      <Text fontWeight={400} mb={2} display="flex" alignItems="center">
        Select the desired composition for:{" "}
        <chakra.b mx={1}>{` ${name}`}</chakra.b> {`($${symbol})`}. You will be
        able to decide the weights on the next screen.
      </Text>
      <Text>You can also choose from which pool to buy the assets</Text>
      <Alert status="info" borderRadius={12} fontSize="sm" my={4}>
        <AlertIcon />
        You need to select at least two different assets
      </Alert>
      <InputGroup my={4}>
        <Input
          placeholder="Filter by name, symbol, address, or pool address"
          variant="filled"
          fontSize="sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <InputRightElement children={<BiSearch color="green.500" />} />
      </InputGroup>
      <Table
        columns={[
          {
            Header: "Name",
            accessor: "name",
          },
          {
            Header: `Price (ETH/${CurrentNetwork.currencyInfo.symbol})`,
            accessor: "price",
          },
          {
            Header: "Pool",
            accessor: "pool",
          },
          {
            Header: "Protocol",
            accessor: "protocol",
          },
          {
            Header: "Select",
            accessor: "select",
          },
        ]}
        data={makeData(pools)}
      />
      <Flex justify="flex-end" mt={4}>
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
