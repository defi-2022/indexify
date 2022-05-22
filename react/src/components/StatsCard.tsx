import {
  Avatar,
  Box,
  Skeleton,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";

interface StatsCardProps {
  title: string;
  number: number;
  icon: string;
  loading?: boolean;
}

const StatsCard = ({ title, number, icon, loading }: StatsCardProps) => {
  const bg = useColorModeValue("gray.100", "gray.700");
  return (
    <Flex bg={bg} borderRadius="3xl" p={4} align="center">
      <Stat>
        <StatLabel>{title}</StatLabel>
        <Skeleton borderRadius={12} isLoaded={!loading} w={20}>
          <StatNumber>{number || 0}</StatNumber>
        </Skeleton>
      </Stat>
      <Avatar src={icon} size="md" />
    </Flex>
  );
};
export default StatsCard;
