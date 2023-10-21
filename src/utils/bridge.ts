import { TabTime } from "../types";

export const getTabtimes = async (): Promise<TabTime[]> => {
  return new Promise(resolve => {
    chrome.runtime.sendMessage('getTabtimes', resolve);
  });
}
