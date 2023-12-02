import analyzes from "./analyzes";
import installNotice from "./installed";
import tabtimes from "./tabtimes";

const main = async () => {
  chrome.runtime.onInstalled.addListener(installNotice);

  console.log("kartrak - background script started");
  tabtimes();
  analyzes();

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTabId") {
      const tabId = sender.tab?.id;
      sendResponse({ tabId });
    }
  });
};

main();
