import { TabTime } from "../../../types";
import { DateRange, Range } from "../types";

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
};

export const formatTime = (time: number): string => {
  const seconds = Math.floor(time / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;
  const milliseconds = time % 1000;

  let formattedTime = "";

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
};

export const getFormattedTime = (
  tabtimes: TabTime[],
  dateRange?: DateRange,
): string => {
  const totalTabTime = tabtimes.reduce((total, worktime) => {
    const startAt = new Date(worktime.startAt);
    const endAt = worktime.endAt ? new Date(worktime.endAt) : new Date();

    // Check if the worktime is within the specified date range
    if (
      dateRange &&
      (startAt < new Date(dateRange[0]) || endAt > new Date(dateRange[1]))
    ) {
      return total;
    }

    const timeDiff = endAt.getTime() - startAt.getTime();
    return total + timeDiff;
  }, 0);

  return formatTime(totalTabTime);
};

export enum EcoIndexGrade {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  F = "F",
  G = "G",
}

export const getEcoIndexGrade = (ecoIndex: number): string => {
  if (ecoIndex > 80) return EcoIndexGrade.A;
  if (ecoIndex > 70) return EcoIndexGrade.B;
  if (ecoIndex > 55) return EcoIndexGrade.C;
  if (ecoIndex > 40) return EcoIndexGrade.D;
  if (ecoIndex > 25) return EcoIndexGrade.E;
  if (ecoIndex > 10) return EcoIndexGrade.F;
  return EcoIndexGrade.G;
};

export const getEcoIndexText = (ecoIndex: number): string => {
  if (ecoIndex > 80) return "Excellent!";
  if (ecoIndex > 70) return "Bravo.";
  if (ecoIndex > 55) return "Pas mal.";
  if (ecoIndex > 40) return "Peut mieux faire.";
  if (ecoIndex > 25) return "Aïe aïe...";
  if (ecoIndex > 10) return "Y'a du boulot...";
  return "Que dire ?";
};

export const formatLiters = (volumeInCL: number): string => {
  if (volumeInCL >= 10000) {
    return (volumeInCL / 1000).toFixed(2) + "L";
  } else if (volumeInCL >= 100) {
    return (volumeInCL / 100).toFixed(2) + "dL";
  } else {
    return volumeInCL.toFixed(2) + "cL";
  }
};

export const formatCO2e = (gramsCO2e: number): string => {
  if (gramsCO2e >= 1000) {
    return (gramsCO2e / 1000).toFixed(2) + "kg";
  } else {
    return gramsCO2e.toFixed(2) + "g";
  }
};

export const computeGreenhouseGasesEmissionfromEcoIndex = (
  ecoIndex: number,
) => {
  return 2 + (2 * (50 - ecoIndex)) / 100;
};

export const computeWaterConsumptionfromEcoIndex = (ecoIndex: number) => {
  return 3 + (3 * (50 - ecoIndex)) / 100;
};

export enum SmileyType {
  Happy = "happy",
  Good = "good",
  Neutral = "neutral",
  Sad = "sad",
  Bad = "bad",
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
};

type Fetcher = (...args: Parameters<typeof fetch>) => Promise<any>;

export const fetcher: Fetcher = (...args) =>
  fetch(...args).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  });

export const nFormatter = (num: number, digits: number) => {
  const si = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
};

export const nFormatterOctets = (num: number, digits: number) => {
  const si = [
    { value: 1, symbol: "o" },
    { value: 1024, symbol: "Ko" },
    { value: 1024 * 1024, symbol: "Mo" },
    { value: 1024 * 1024 * 1024, symbol: "Go" },
    { value: 1024 * 1024 * 1024 * 1024, symbol: "To" },
    { value: 1024 * 1024 * 1024 * 1024 * 1024, symbol: "Po" },
    { value: 1024 * 1024 * 1024 * 1024 * 1024 * 1024, symbol: "Eo" },
  ];

  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
};

export const getDateRange = (range: Range): DateRange => {
  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (range) {
    case Range.Day:
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 1);
      endDate = new Date(now);
      break;

    case Range.Week:
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      endDate = new Date(now);
      break;

    case Range.Month:
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      endDate = new Date(now);
      break;

    case Range.Year:
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      endDate = new Date(now);
      break;

    default:
      throw new Error(`Invalid range: ${range}`);
  }

  return [startDate.toISOString(), endDate.toISOString()];
};
