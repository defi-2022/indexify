import {
  Avatar,
  Box,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";

interface StatsCardProps {
  title: string;
  number: number;
  icon: string;
}

const StatsCard = ({ title, number, icon }: StatsCardProps) => {
  const bg = useColorModeValue("gray.100", "gray.700");
  return (
    <Box bg={bg} borderRadius="3xl" p={4} overflow="hidden" position="relative">
      <Stat>
        <StatLabel>{title}</StatLabel>
        <StatNumber fontSize={40}>{number}</StatNumber>
      </Stat>
      <Avatar
        src={icon}
        size="xl"
        position="absolute"
        top={3}
        right={4}
        transform="scale(2)"
      />
    </Box>
  );
};
export default StatsCard;
