import { Analyze } from "../../types";
import { getChromeLocalStorage, setChromeLocalStorage } from "../../utils/asyncChromeStorage";

const analyzes = async () => {

  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading') {
      let analyzes = await getChromeLocalStorage<Analyze[]>('analyzes') || [];
      const analyze = analyzes.find(analyze => analyze.url === tab.url);
      if (analyze) {
        analyze.requestAmount = 0;
        analyze.pageWeight = 0;
        analyze.domSize = 0;
        analyze.updatedAt = new Date().toISOString();
        console.log('kartrak - reset analyze', analyze)
      }
      await setChromeLocalStorage('analyzes', analyzes);
    }
  });

  chrome.webRequest.onBeforeRequest.addListener((details) => {
    handleBeforeRequest(details);
  }, { urls: ["<all_urls>"] });

  chrome.webRequest.onHeadersReceived.addListener((details) => {
    handleHeadersReceived(details);
  }, { urls: ["<all_urls>"] }, ["responseHeaders"]);

  async function handleBeforeRequest(details: chrome.webRequest.WebRequestBodyDetails) {
    const tab = await findTab(details.tabId);
    if (!tab) {
      return;
    }

    let analyzes = await getAnalyzes();
    const analyze = analyzes.find(a => a.url === tab.url);

    if (analyze) {
      analyze.requestAmount = (analyze.requestAmount || 0) + 1;
    } else {
      analyzes.push({
        url: tab.url!,
        requestAmount: 1,
      });
    }

    await setAnalyzes(analyzes);
  }

  async function handleHeadersReceived(details: chrome.webRequest.WebResponseHeadersDetails) {
    const tab = await findTab(details.tabId);
    if (!tab) {
      return;
    }

    const contentLengthHeader = details.responseHeaders?.find(header => header.name === 'content-length')?.value;
    if (contentLengthHeader) {
      let analyzes = await getAnalyzes();
      const analyze = analyzes.find(a => a.url === tab.url);

      if (analyze) {
        analyze.pageWeight = (analyze.pageWeight || 0) + parseInt(contentLengthHeader);
      } else {
        analyzes.push({
          url: tab.url!,
          pageWeight: parseInt(contentLengthHeader),
        });
      }

      await setAnalyzes(analyzes);
    }
  }

  async function findTab(tabId: number): Promise<chrome.tabs.Tab | undefined> {
    const tabs = await new Promise(resolve => {
      chrome.tabs.query({}, resolve);
    }) as chrome.tabs.Tab[];
    return tabs.find(tab => tab.id === tabId);
  }

  async function getAnalyzes() {
    return (await getChromeLocalStorage('analyzes') as Analyze[]) || [];
  }

  async function setAnalyzes(analyzes: Analyze[]) {
    await setChromeLocalStorage('analyzes', analyzes);
  }


}

export default analyzes;