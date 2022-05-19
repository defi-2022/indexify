import { interpolateRgb } from "d3-interpolate";
import { range } from "d3-array";

export const generateArrayOfColors = (
  colorA: string,
  colorB: string,
  steps: number = 1
): string[] => {
  const colorInterpolator = interpolateRgb(colorA, colorB);
  const colorArray = range(0, 1 + 1 / steps, 1 / (steps - 1)).map(function (d) {
    return colorInterpolator(d);
  });

  return colorArray;
};
