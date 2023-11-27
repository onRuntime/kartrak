const getHexColorFromCssVariable = (cssVariable: string) => {
  const match = cssVariable.match(/#(?:[0-9a-fA-F]{3}){1,2}\b/);
  return match ? match[0] : "#000000";
};

export const getCurrentEcoIndexColor = (ecoIndex?: number, asHex = false) => {
  let result = "var(--red, #e40000)";

  if (ecoIndex === undefined) {
    result = "var(--primary, #014335)";
  } else if (ecoIndex >= 75) {
    result = "var(--green, #009245)";
  } else if (ecoIndex >= 50) {
    result = "var(--yellow, #dcb903)";
  } else if (ecoIndex >= 25) {
    result = "var(--orange, #dc6803)";
  }

  if (asHex) {
    result = getHexColorFromCssVariable(result);
  }

  return result;
};

export const getCurrentEcoIndexBackgroundColor = (
  ecoIndex?: number,
  asHex = false,
) => {
  let result = "var(--red-80, #ffcfcf)";

  if (ecoIndex === undefined) {
    result = "var(--green-10, #f1faf1)";
  } else if (ecoIndex >= 75) {
    result = "var(--green-80, #cce9da)";
  } else if (ecoIndex >= 50) {
    result = "var(--yellow-80, #fef2c7)";
  } else if (ecoIndex >= 25) {
    result = "var(--orange-80, #fef0c7)";
  }

  if (asHex) {
    result = getHexColorFromCssVariable(result);
  }

  return result;
};

export const computeQuantile = (quantiles: number[], value: number): number => {
  for (let i = 1; i < quantiles.length; i++) {
    if (value < quantiles[i]) {
      return (
        i - 1 + (value - quantiles[i - 1]) / (quantiles[i] - quantiles[i - 1])
      );
    }
  }
  return quantiles.length - 1;
};

const quantiles_dom = [
  0, 47, 75, 159, 233, 298, 358, 417, 476, 537, 603, 674, 753, 843, 949, 1076,
  1237, 1459, 1801, 2479, 594601,
];
const quantiles_req = [
  0, 2, 15, 25, 34, 42, 49, 56, 63, 70, 78, 86, 95, 105, 117, 130, 147, 170,
  205, 281, 3920,
];
const quantiles_size = [
  0, 1.37, 144.7, 319.53, 479.46, 631.97, 783.38, 937.91, 1098.62, 1265.47,
  1448.32, 1648.27, 1876.08, 2142.06, 2465.37, 2866.31, 3401.59, 4155.73,
  5400.08, 8037.54, 223212.26,
];

export const computeEcoIndex = (
  dom: number,
  req: number,
  size: number,
): number => {
  const q_dom: number = computeQuantile(quantiles_dom, dom);
  const q_req: number = computeQuantile(quantiles_req, req / 8 / 1024);
  const q_size: number = computeQuantile(quantiles_size, size);

  return 100 - (5 * (3 * q_dom + 2 * q_req + q_size)) / 6;
};
