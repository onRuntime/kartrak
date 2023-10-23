import { Analyze } from "../../types";
import { getChromeLocalStorage, setChromeLocalStorage } from "./utils/asyncChromeLocalStorage";

const analyzes = async () => {
  let analyzes = await getChromeLocalStorage<Analyze[]>('analyzes') || [];

  chrome.webRequest.onBeforeRequest.addListener((details) => {
    const handler = async () => {
      const tabs = await new Promise<chrome.tabs.Tab[]>(resolve => {
        chrome.tabs.query({}, resolve);
      });
      const tab = tabs.find(tab => tab.id === details.tabId);
      if (!tab) {
        return;
      }

      const analyze = analyzes.find(analyze => analyze.url === tab.url);
      if (analyze) {
        analyze.requestAmount++;
        analyze.updatedAt = new Date().toISOString();
      } else {
        analyzes.push({
          url: tab.url || 'unknown',
          requestAmount: 1,
          updatedAt: new Date().toISOString(),
        });
      }
    };

    handler();
  }, { urls: ["<all_urls>"] });

  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      const analyze = analyzes.find(analyze => analyze.url === tab.url);
      if (analyze) {
        analyze.requestAmount = 0;
        analyze.updatedAt = new Date().toISOString();
        console.log('kartrak - reset analyze', analyze.url)
      }
      await setChromeLocalStorage('analyzes', analyzes);
    }
  });
}

export default analyzes;