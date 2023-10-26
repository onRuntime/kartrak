import { TabTime } from "../../types";
import { getChromeLocalStorage, setChromeLocalStorage } from "../../utils/asyncChromeStorage";
import { cleanUrl } from "../../utils/url";

const tabtimes = async () => {// await setChromeLocalStorage('tabtimes', []);
  let tabtimes = await getChromeLocalStorage<TabTime[]>('tabtimes') || [];

  const handleTabChange = async () => {
    // find the tabtimes which are not ended, and end them
    const now = new Date();
    tabtimes = tabtimes.map(tabtime => {
      if (!tabtime.endAt) {
        tabtime.endAt = now.toISOString();
      }
      return tabtime;
    });

    // get the current tab
    const tabs = await new Promise<chrome.tabs.Tab[]>(resolve => {
      chrome.tabs.query({ active: true, currentWindow: true }, resolve);
    });
    const tab = tabs[0];
    if (!tab) {
      return;
    }

    console.log('kartrak - handle tab change', tab.title)

    // find the tabtime for the current tab
    const tabtime = tabtimes.find(tabtime => cleanUrl(tabtime.url) === cleanUrl(tab.url || '') && tabtime.endAt === undefined);
    if (!tabtime) {
      // if there is no tabtime for the current tab, create one
      tabtimes.push({
        url: cleanUrl(tab.url || ''),
        favIconUrl: tab.favIconUrl,
        startAt: now.toISOString(),
      });
    }

    // save the tabtimes
    await setChromeLocalStorage('tabtimes', tabtimes);
  };

  chrome.tabs.onActivated.addListener(handleTabChange);

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      handleTabChange();
    }
  });

  chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
    // save the tabtimes
    await setChromeLocalStorage('tabtimes', tabtimes);
  });

  chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
    if (details.tabId) {
      handleTabChange();
    }
  });

  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message === 'getTabTimes') {
      sendResponse(tabtimes);
    }
  });
};

export default tabtimes;