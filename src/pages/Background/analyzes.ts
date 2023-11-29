import { merge } from "lodash";

import { Analyze } from "../../types";
import { updateBadge } from "../../utils/chromeBadge";
import {
  getChromeLocalStorage,
  setChromeLocalStorage,
} from "../../utils/chromeStorage";
import { cleanUrl } from "../../utils/url";

const analyzes = async () => {
  let analyzes = (await getChromeLocalStorage<Analyze[]>("analyzes")) || [];

  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    const analyze = analyzes.find(
      (analyze) => cleanUrl(analyze.url) === cleanUrl(tab.url || ""),
    );
    if (changeInfo.status === "loading" && analyze && !analyze.isLoading) {
      analyze.requestAmount = 0;
      analyze.pageWeight = 0;
      analyze.domSize = 0;
      analyze.updatedAt = new Date().toISOString();
      analyze.isLoading = true;
      console.log("kartrak - reset analyze", analyze);
      await updateBadge(analyze, tabId);

      await setChromeLocalStorage("analyzes", analyzes);
    } else if (
      changeInfo.status === "complete" &&
      analyze &&
      analyze.isLoading
    ) {
      analyze.isLoading = false;
      analyze.updatedAt = new Date().toISOString();
      console.log("kartrak - update analyze", analyze);
      await updateBadge(analyze, tabId);

      await setChromeLocalStorage("analyzes", analyzes);
    }
  });

  chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    const analyze = analyzes.find(
      (analyze) => cleanUrl(analyze.url) === cleanUrl(details.url || ""),
    );

    if (analyze && analyze.isLoading) {
      // Reset the analysis if the page is being reloaded manually
      analyze.requestAmount = 0;
      analyze.pageWeight = 0;
      analyze.domSize = 0;
      analyze.updatedAt = new Date().toISOString();
      analyze.isLoading = true;
      console.log("kartrak - reset analyze (manual reload)", analyze);

      setChromeLocalStorage("analyzes", analyzes);
    }
  });

  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      handleBeforeRequest(details);
    },
    { urls: ["<all_urls>"] },
  );

  chrome.webRequest.onHeadersReceived.addListener(
    (details) => {
      handleHeadersReceived(details);
    },
    { urls: ["<all_urls>"] },
    ["responseHeaders"],
  );

  async function handleBeforeRequest(
    details: chrome.webRequest.WebRequestBodyDetails,
  ) {
    const tab = await findTab(details.tabId);
    if (!tab) {
      return;
    }

    const analyze = analyzes.find(
      (a) => cleanUrl(a.url) === cleanUrl(tab.url || ""),
    );

    if (analyze) {
      analyze.requestAmount = (analyze.requestAmount || 0) + 1;
      await updateBadge(analyze, details.tabId);
    } else {
      analyzes.push({
        url: cleanUrl(tab.url || ""),
        requestAmount: 1,
      });
    }

    await setChromeLocalStorage("analyzes", analyzes);
  }

  async function handleHeadersReceived(
    details: chrome.webRequest.WebResponseHeadersDetails,
  ) {
    const tab = await findTab(details.tabId);
    if (!tab) {
      return;
    }

    const contentLengthHeader = details.responseHeaders?.find(
      (header) => header.name === "content-length",
    )?.value;
    if (contentLengthHeader) {
      const analyze = analyzes.find(
        (a) => cleanUrl(a.url) === cleanUrl(tab.url || ""),
      );

      if (analyze) {
        analyze.pageWeight =
          (analyze.pageWeight || 0) + parseInt(contentLengthHeader, 10);
        await updateBadge(analyze, details.tabId);
      } else {
        analyzes.push({
          url: cleanUrl(tab.url || ""),
          pageWeight: parseInt(contentLengthHeader, 10),
        });
      }

      await setChromeLocalStorage("analyzes", analyzes);
    }
  }

  async function findTab(tabId: number): Promise<chrome.tabs.Tab | undefined> {
    const tabs = (await new Promise((resolve) => {
      chrome.tabs.query({}, resolve);
    })) as chrome.tabs.Tab[];
    return tabs.find((tab) => tab.id === tabId);
  }

  chrome.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {
      if (message.action === "getAnalyzes") {
        sendResponse(analyzes);
      } else if (message.action === "setAnalyzes") {
        analyzes = merge(analyzes, message.analyzes);
        await setChromeLocalStorage("analyzes", analyzes);
        sendResponse(true);
      } else if (message.action === "updateBadge") {
        const analyze = analyzes.find(
          (analyze) =>
            cleanUrl(analyze.url) === cleanUrl(sender.tab?.url || ""),
        );
        if (analyze) {
          await updateBadge(analyze, sender.tab?.id || 0);
        }
      }
    },
  );
};

export default analyzes;
