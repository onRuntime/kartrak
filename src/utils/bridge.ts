import { TabTime } from "../types";

export const getTabTimes = async (): Promise<TabTime[]> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage("getTabTimes", resolve);
  });
};
