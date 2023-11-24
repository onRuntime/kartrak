import analyzes from "./analyzes";
import installNotice from "./installed";
import tabtimes from "./tabtimes";

const main = async () => {
  chrome.runtime.onInstalled.addListener(installNotice);

  console.log("kartrak - background script started");
  tabtimes();
  analyzes();
};

main();
