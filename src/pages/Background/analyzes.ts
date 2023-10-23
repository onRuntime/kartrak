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
        console.log('kartrak - update analyze');
        analyze.requestAmount = (analyze.requestAmount || 0) + 1;
        analyze.updatedAt = new Date().toISOString();
      } else {
        console.log('kartrak - push analyze');
        analyzes.push({
          url: tab.url!,
          requestAmount: 1,
          updatedAt: new Date().toISOString(),
        });
      }

      await setChromeLocalStorage('analyzes', analyzes);
    };

    handler();
  }, { urls: ["<all_urls>"] });

  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading') {
      const analyze = analyzes.find(analyze => analyze.url === tab.url);
      if (analyze) {
        analyze.requestAmount = 0;
        analyze.pageWeight = 0;
        analyze.updatedAt = new Date().toISOString();
        console.log('kartrak - reset analyze', analyze.url)
      }
      await setChromeLocalStorage('analyzes', analyzes);
    }
  });

  // get request size
  chrome.webRequest.onHeadersReceived.addListener((details) => {
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
        const contentLengthHeader = details.responseHeaders?.find(header => header.name === 'content-length')?.value;
        if (contentLengthHeader) {
          analyze.pageWeight = (analyze.pageWeight || 0) + parseInt(contentLengthHeader);
          analyze.updatedAt = new Date().toISOString();
        }
      }

      await setChromeLocalStorage('analyzes', analyzes);
    };

    handler();

  }, { urls: ["<all_urls>"] }, ["responseHeaders"]);

}

export default analyzes;