import dayjs from "dayjs";
import { TabTime } from "../../../types";

export const extractDomainFromUrl = (url: string): string | null => {
  // Regular expression to match the domain in a URL
  const domainRegex = /:\/\/(www\.)?([^/]+)/;

  // Use the exec method to search for the pattern in the URL
  const match = domainRegex.exec(url);

  if (match && match[2]) {
    // match[2] contains the domain
    return match[2];
  } else {
    // No match found, return null
    return null;
  }
}

export const formatTime = (time: number): string => {
  const seconds = Math.floor(time / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;
  const milliseconds = time % 1000;

  let formattedTime = '';

  if (hours > 0) {
    formattedTime = `${hours}h ${remainingMinutes}m`;
  } else if (minutes > 0) {
    formattedTime = `${minutes}m ${remainingSeconds}s`;
  } else if (seconds > 0) {
    formattedTime = `${seconds}s`;
  } else {
    formattedTime = `${milliseconds}ms`;
  }

  return formattedTime;
}

export const getFormattedTime = (tabtimes: TabTime[]) => {
  const totalTabTime = tabtimes
    .reduce((total, worktime) => {
      const startAt = dayjs(worktime.startAt);
      const endAt = worktime.endAt ? dayjs(worktime.endAt) : dayjs();
      const timeDiff = endAt.diff(startAt);
      return total + timeDiff;
    }, 0);

  return formatTime(totalTabTime);
}

export enum EcoIndexGrade {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  F = "F",
  G = "G"
}

export const getEcoIndexGrade = (ecoIndex: number): string => {
  if (ecoIndex > 80) return EcoIndexGrade.A;
  if (ecoIndex > 70) return EcoIndexGrade.B;
  if (ecoIndex > 55) return EcoIndexGrade.C;
  if (ecoIndex > 40) return EcoIndexGrade.D;
  if (ecoIndex > 25) return EcoIndexGrade.E;
  if (ecoIndex > 10) return EcoIndexGrade.F;
  return EcoIndexGrade.G;
}
export const computeQuantile = (quantiles: number[], value: number): number => {
  for (let i = 1; i < quantiles.length; i++) {
    if (value < quantiles[i]) {
      return i - 1 + (value - quantiles[i - 1]) / (quantiles[i] - quantiles[i - 1]);
    }
  }
  return quantiles.length - 1;
}

let quantiles_dom = [0, 47, 75, 159, 233, 298, 358, 417, 476, 537, 603, 674, 753, 843, 949, 1076, 1237, 1459, 1801, 2479, 594601];
let quantiles_req = [0, 2, 15, 25, 34, 42, 49, 56, 63, 70, 78, 86, 95, 105, 117, 130, 147, 170, 205, 281, 3920];
let quantiles_size = [0, 1.37, 144.7, 319.53, 479.46, 631.97, 783.38, 937.91, 1098.62, 1265.47, 1448.32, 1648.27, 1876.08, 2142.06, 2465.37, 2866.31, 3401.59, 4155.73, 5400.08, 8037.54, 223212.26];


export const computeEcoIndex = (dom: number, req: number, size: number): number => {
  const q_dom: number = computeQuantile(quantiles_dom, dom);
  const q_req: number = computeQuantile(quantiles_req, req);
  const q_size: number = computeQuantile(quantiles_size, size);

  return 100 - 5 * (3 * q_dom + 2 * q_req + q_size) / 6;
}

export const formatLiters = (volumeInCL: number): string => {
  if (volumeInCL >= 10000) {
    return (volumeInCL / 1000).toFixed(2) + 'L';
  } else if (volumeInCL >= 100) {
    return (volumeInCL / 100).toFixed(2) + 'dL';
  } else {
    return volumeInCL.toFixed(2) + 'cL';
  }
}

export const formatCO2e = (gramsCO2e: number): string => {
  if (gramsCO2e >= 1000) {
    return (gramsCO2e / 1000).toFixed(2) + 'kg';
  } else {
    return gramsCO2e.toFixed(2) + 'g';
  }
}

export const computeGreenhouseGasesEmissionfromEcoIndex = (ecoIndex: number) => {
  return (2 + 2 * (50 - ecoIndex) / 100);
}

export const computeWaterConsumptionfromEcoIndex = (ecoIndex: number) => {
  return (3 + 3 * (50 - ecoIndex) / 100);
}

export enum SmileyType {
  Happy = 'happy',
  Good = 'good',
  Neutral = 'neutral',
  Sad = 'sad',
  Bad = 'bad',
}

export const getSmileyType = (ecoIndex?: number) => {
  return ecoIndex === undefined
    ? SmileyType.Neutral
    : ecoIndex >= 80
      ? SmileyType.Happy
      : ecoIndex >= 60
        ? SmileyType.Good
        : ecoIndex >= 40
          ? SmileyType.Neutral
          : ecoIndex >= 20
            ? SmileyType.Sad
            : SmileyType.Bad;
};

export const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}