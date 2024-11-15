import { Analyze } from "../../types";
import { updateBadge } from "../../utils/chromeBadge";
import {
  getChromeLocalStorage,
  setChromeLocalStorage,
} from "../../utils/chromeStorage";
import { cleanUrl } from "../../utils/url";

const analyzes = async () => {
  const analyzes = (await getChromeLocalStorage<Analyze[]>("analyzes")) || [];

  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    const analyze = analyzes.find(
      (analyze) => cleanUrl(analyze.url) === cleanUrl(tab.url || ""),
    );
    if (changeInfo.status === "loading" && analyze && !analyze.isLoading) {
      analyze.requestAmount = 0;
      analyze.pageWeight = 0;
      // Ne pas réinitialiser le domSize ici car il sera mis à jour par le content script
      analyze.updatedAt = new Date().toISOString();
      analyze.isLoading = true;
      console.log("[kartrak][background][analyze] reset analyze", analyze);
      await updateBadge(analyze, tabId);

      await setChromeLocalStorage("analyzes", analyzes);
    } else if (
      changeInfo.status === "complete" &&
      analyze &&
      analyze.isLoading
    ) {
      analyze.isLoading = false;
      analyze.updatedAt = new Date().toISOString();
      console.log("[kartrak][background][analyze] update analyze", analyze);
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
      // Ne pas réinitialiser le domSize ici non plus
      analyze.updatedAt = new Date().toISOString();
      analyze.isLoading = true;
      console.log(
        "[kartrak][background][analyze] reset analyze (manual reload)",
        analyze,
      );

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
        // Nouvelle logique de mise à jour
        message.analyzes.forEach((newAnalyze: Analyze) => {
          const existingIndex = analyzes.findIndex(
            (a) => cleanUrl(a.url) === cleanUrl(newAnalyze.url),
          );

          if (existingIndex !== -1) {
            // Mise à jour intelligente qui préserve les valeurs existantes
            const existing = analyzes[existingIndex];
            analyzes[existingIndex] = {
              ...existing,
              ...newAnalyze,
              // Préserver certaines valeurs si elles existent déjà
              domSize: newAnalyze.domSize ?? existing.domSize,
              pageWeight: newAnalyze.pageWeight ?? existing.pageWeight,
              requestAmount: newAnalyze.requestAmount ?? existing.requestAmount,
              isLoading: newAnalyze.isLoading ?? existing.isLoading,
              updatedAt: newAnalyze.updatedAt || new Date().toISOString(),
            };
            console.log(
              "[kartrak][background][analyze] updated analyze",
              analyzes[existingIndex],
            );
          } else {
            // Nouvelle analyse
            analyzes.push(newAnalyze);
            console.log(
              "[kartrak][background][analyze] added new analyze",
              newAnalyze,
            );
          }
        });

        await setChromeLocalStorage("analyzes", analyzes);
        sendResponse(true);

        // Notifier les autres parties de l'extension
        try {
          chrome.runtime.sendMessage({ action: "analyzesUpdated" });
        } catch (error) {
          console.error(
            "[kartrak][background][analyze] error sending update notification:",
            error,
          );
        }
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
