import { Analyze } from "../../../types";
import {
  getAnalyzes,
  getTabId,
  setAnalyzes,
  updateBadge,
} from "../../../utils/chromeBridge";
import { cleanUrl } from "../../../utils/url";

const getDomSizeWithoutSvg = (): number => {
  let dom_size = document.getElementsByTagName("*").length;
  const svgElements = document.getElementsByTagName("svg");
  for (let i = 0; i < svgElements.length; i++) {
    dom_size -= getNbChildsExcludingNestedSvg(svgElements[i]) - 1;
  }
  return dom_size;
};

const getNbChildsExcludingNestedSvg = (element: Element): number => {
  if (element.nodeType === Node.TEXT_NODE) return 0;
  let nb_elements = 1;

  for (let i = 0; i < element.childNodes.length; i++) {
    const childNode = element.childNodes[i];

    if (childNode.nodeType === Node.ELEMENT_NODE) {
      const childElement = childNode as Element;
      if (childElement.tagName !== "svg") {
        nb_elements += getNbChildsExcludingNestedSvg(childElement);
      } else {
        nb_elements += 1;
      }
    }
  }

  return nb_elements;
};

const updateAnalyzeDomSize = async () => {
  try {
    const analyzeResult = await getAnalyzes();
    if (!analyzeResult) {
      console.warn(
        "[kartrak][content][analyze] No analyzes found, creating new array",
      );
    }

    const analyzes: Analyze[] = analyzeResult || [];
    const currentUrl = cleanUrl(window.location.href);

    if (!currentUrl) {
      console.error("[kartrak][content][analyze] No valid URL found");
      return;
    }

    const domSize = getDomSizeWithoutSvg();
    console.log("[kartrak][content][analyze] Current DOM size:", domSize);

    let analyze = analyzes.find((a) => cleanUrl(a.url) === currentUrl);

    if (analyze) {
      console.log("[kartrak][content][analyze] Updating existing analyze:", {
        oldDomSize: analyze.domSize,
        newDomSize: domSize,
        url: currentUrl,
      });

      analyze.domSize = domSize;
      analyze.updatedAt = new Date().toISOString();
    } else {
      console.log(
        "[kartrak][content][analyze] Creating new analyze for URL:",
        currentUrl,
      );

      analyze = {
        url: currentUrl,
        domSize,
        updatedAt: new Date().toISOString(),
      };
      analyzes.push(analyze);
    }

    // Mise à jour du badge
    try {
      const tabId = await getTabId();
      if (tabId) {
        await updateBadge(tabId);
      }
    } catch (error) {
      console.error("[kartrak][content][analyze] Error updating badge:", error);
    }

    // Sauvegarde des analyses
    try {
      await setAnalyzes(analyzes);
      console.log("[kartrak][content][analyze] Successfully saved analyzes");
    } catch (error) {
      console.error(
        "[kartrak][content][analyze] Error saving analyzes:",
        error,
      );
      return;
    }

    // Notification de la popup - version corrigée
    try {
      // Version 1: Simple notification sans attendre de réponse
      chrome.runtime.sendMessage({
        action: "analyzeUpdated",
        data: {
          url: currentUrl,
          domSize,
          timestamp: new Date().toISOString(),
        },
      });
      console.log("[kartrak][content][analyze] Update notification sent");
    } catch (error) {
      // Gérer uniquement les erreurs réelles, pas la fermeture du port
      if (
        error instanceof Error &&
        !error.message.includes("message port closed")
      ) {
        console.error(
          "[kartrak][content][analyze] Error notifying update:",
          error,
        );
      }
    }
  } catch (error) {
    console.error(
      "[kartrak][content][analyze] Global error in updateAnalyzeDomSize:",
      error,
    );
  }
};

const analyzeDomSize = async () => {
  try {
    await updateAnalyzeDomSize();

    let lastUpdate = Date.now();
    const MIN_UPDATE_INTERVAL = 1000; // Minimum 1 seconde entre les mises à jour

    const observer = new MutationObserver(async (mutations) => {
      const now = Date.now();
      if (now - lastUpdate < MIN_UPDATE_INTERVAL) {
        return; // Ignorer les mises à jour trop fréquentes
      }

      console.log(
        "[kartrak][content][analyze] DOM mutations detected:",
        mutations.length,
      );
      await updateAnalyzeDomSize();
      lastUpdate = now;
    });

    observer.observe(document, {
      childList: true,
      subtree: true,
    });

    const cleanup = () => {
      console.log("[kartrak][content][analyze] Disconnecting observer");
      observer.disconnect();
    };

    window.addEventListener("unload", cleanup);
    return cleanup;
  } catch (error) {
    console.error(
      "[kartrak][content][analyze] Error setting up DOM analysis:",
      error,
    );
  }
};

export default analyzeDomSize;
