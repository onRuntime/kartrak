import { Analyze, TabTime } from "../types";

export const getTabTimes = async (): Promise<TabTime[]> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: "getTabTimes" }, resolve);
  });
};

export const getAnalyzes = async (): Promise<Analyze[]> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: "getAnalyzes" }, resolve);
  });
};

export const setAnalyzes = async (analyzes: Analyze[]): Promise<boolean> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: "setAnalyzes", analyzes }, resolve);
  });
};

export const getTabId = async (): Promise<number | undefined> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: "getTabId" }, (response) => {
      resolve(response?.tabId);
    });
  });
};

export const updateBadge = async (tabId: number) => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: "updateBadge", tabId }, resolve);
  });
};
