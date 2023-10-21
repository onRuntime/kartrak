import dayjs from "dayjs";
import { TabTime } from "../../../types";

export const extractDomainFromUrl = (url: string): string | null => {
  // Regular expression to match the domain in a URL
  const domainRegex = /:\/\/(www\.)?([^/]+)\//;

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

export const getFormattedTime = (tabtimes: TabTime[]) => {
  const totalTabTime = tabtimes
    .reduce((total, worktime) => {
      const startAt = dayjs(worktime.startAt);
      const endAt = worktime.endAt ? dayjs(worktime.endAt) : dayjs();
      const timeDiff = endAt.diff(startAt);
      return total + timeDiff;
    }, 0);

  const seconds = Math.floor(totalTabTime / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;
  const milliseconds = totalTabTime % 1000;

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