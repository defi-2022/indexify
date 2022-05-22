import React from "react";
import { Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import { generateArrayOfColors } from "../../lib/colors";

interface DataPoint {
  name: string;
  value: number;
}

interface DonutChartProps {
  data: DataPoint[];
  chartName: string;
  w?: number;
  h?: number;
}

const renderActiveShape = (props: any, chartName: string) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        fontSize={28}
        fontWeight={700}
        fontFamily="var(--chakra-fonts-heading)"
        letterSpacing={-1}
      >
        {chartName}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        fontSize={14}
        fontWeight={700}
        fontFamily="var(--chakra-fonts-heading)"
      >
        {payload.name}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
        fontSize={12}
        fontFamily="var(--chakra-fonts-heading)"
      >
        {`(Weight: ${value.toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default function DonutChart({
  data,
  chartName,
  w = 400,
  h = 400,
}: DonutChartProps) {
  const colors = generateArrayOfColors(
    "rgb(255, 78, 205)",
    "rgb(0, 112, 243)",
    data.length
  );
  const [activeIndex, setActiveIndex] = React.useState(0);
  const onPieEnter = (data: any, index: number) => {
    setActiveIndex(index);
  };
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart height={h} width={w}>
        <Pie
          stroke="none"
          activeIndex={activeIndex}
          activeShape={(props) => renderActiveShape(props, chartName)}
          data={data.map((item, i) => ({ ...item, fill: colors[i] }))}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={100}
          dataKey="value"
          onMouseEnter={onPieEnter}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
