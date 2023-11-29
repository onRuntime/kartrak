import analyzes from "./analyzes";
import tabtimes from "./tabtimes";

const main = async () => {
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
