import { TabTime } from "../../types";
import {
  getChromeLocalStorage,
  setChromeLocalStorage,
} from "../../utils/chromeStorage";
import { cleanUrl } from "../../utils/url";

interface StorageError extends Error {
  readonly name: string;
  readonly message: string;
  readonly code?: string;
}

const SAVE_BUFFER_DELAY = 1000; // 1 seconde de délai pour le buffer de sauvegarde

const tabtimes = async () => {
  // Chargement initial des données
  let tabtimes = (await getChromeLocalStorage<TabTime[]>("tabtimes")) || [];
  let saveTimeout: NodeJS.Timeout | null = null;

  // Buffer de sauvegarde pour éviter les écritures trop fréquentes
  const bufferedSave = async () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    saveTimeout = setTimeout(async () => {
      try {
        await setChromeLocalStorage("tabtimes", tabtimes);
        saveTimeout = null;
      } catch (error: unknown) {
        // Typage correct de l'erreur
        const storageError = error as StorageError;
        console.error("Error saving tabtimes:", storageError);

        // Vérifier si c'est une erreur de quota
        if (
          storageError.message?.includes("QUOTA_BYTES") ||
          storageError.code === "QUOTA_BYTES" ||
          chrome.runtime.lastError?.message?.includes("QUOTA_BYTES")
        ) {
          console.warn(
            "Storage quota exceeded, attempting to compress data...",
          );
          await compressAndSave();
        } else {
          console.error("Unhandled storage error:", storageError);
        }
      }
    }, SAVE_BUFFER_DELAY);
  };

  const compressAndSave = async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
      const [recentEntries, oldEntries] = tabtimes.reduce<
        [TabTime[], TabTime[]]
      >(
        ([recent, old], entry) => {
          if (new Date(entry.startAt) > thirtyDaysAgo) {
            recent.push(entry);
          } else {
            old.push(entry);
          }
          return [recent, old];
        },
        [[], []],
      );

      interface CompressedEntry {
        url: string;
        favIconUrl?: string;
        startAt: string;
        totalTime: number;
      }

      const compressedOldEntries = oldEntries.reduce<
        Record<string, CompressedEntry>
      >((acc, entry) => {
        const date = new Date(entry.startAt).toISOString().split("T")[0];
        const key = `${date}-${entry.url}`;

        if (!acc[key]) {
          acc[key] = {
            url: entry.url,
            favIconUrl: entry.favIconUrl,
            startAt: date,
            totalTime: 0,
          };
        }

        if (entry.endAt) {
          const duration =
            new Date(entry.endAt).getTime() - new Date(entry.startAt).getTime();
          acc[key].totalTime += duration;
        }

        return acc;
      }, {});

      tabtimes = [
        ...recentEntries,
        ...Object.values(compressedOldEntries),
      ] as TabTime[];

      await setChromeLocalStorage("tabtimes", tabtimes);
      console.log("Successfully compressed and saved data");
    } catch (error: unknown) {
      const compressionError = error as Error;
      console.error("Failed to compress and save data:", compressionError);

      // Maintenant thirtyDaysAgo est accessible ici
      if (compressionError.message?.includes("QUOTA_BYTES")) {
        console.warn(
          "Even compressed data exceeds quota, falling back to recent data only",
        );
        // Garder seulement les données des 30 derniers jours
        tabtimes = tabtimes.filter(
          (entry) => new Date(entry.startAt) > thirtyDaysAgo,
        );
        await setChromeLocalStorage("tabtimes", tabtimes);
      }
    }
  };

  const handleTabChange = async () => {
    const now = new Date();

    // Mettre à jour les tabtimes existants
    tabtimes = tabtimes.map((tabtime) => {
      if (!tabtime.endAt) {
        tabtime.endAt = now.toISOString();
      }
      return tabtime;
    });

    // Obtenir l'onglet actif
    const tabs = await new Promise<chrome.tabs.Tab[]>((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, resolve);
    });
    const tab = tabs[0];
    if (!tab) return;

    const cleanedUrl = cleanUrl(tab.url || "");
    const existingTabtime = tabtimes.find(
      (tabtime) => cleanUrl(tabtime.url) === cleanedUrl && !tabtime.endAt,
    );

    if (!existingTabtime) {
      tabtimes.push({
        url: cleanedUrl,
        favIconUrl: tab.favIconUrl,
        startAt: now.toISOString(),
      });
    }

    await bufferedSave();
  };

  // Optimisation des event listeners
  const debouncedHandleTabChange = async () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    await handleTabChange();
  };

  chrome.tabs.onActivated.addListener(debouncedHandleTabChange);

  chrome.tabs.onUpdated.addListener((_tabId, changeInfo, _tab) => {
    if (changeInfo.status === "complete") {
      debouncedHandleTabChange();
    }
  });

  chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    if (details.tabId) {
      debouncedHandleTabChange();
    }
  });

  chrome.idle.onStateChanged.addListener(async (newState) => {
    const now = new Date();
    switch (newState) {
      case "active":
        debouncedHandleTabChange();
        break;
      case "idle":
      case "locked":
        tabtimes = tabtimes.map((tabtime) => {
          if (!tabtime.endAt) {
            tabtime.endAt = now.toISOString();
          }
          return tabtime;
        });
        await bufferedSave();
        break;
    }
  });

  chrome.windows.onFocusChanged.addListener(async (windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
      const now = new Date();
      tabtimes = tabtimes.map((tabtime) => {
        if (!tabtime.endAt) {
          tabtime.endAt = now.toISOString();
        }
        return tabtime;
      });
      await bufferedSave();
    } else {
      debouncedHandleTabChange();
    }
  });

  // Gestionnaire de messages optimisé
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === "getTabTimes") {
      const range = message.range; // optionnel : période demandée

      if (range) {
        // Si une période est spécifiée, on filtre les données
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - range);

        const filteredTabtimes = tabtimes.filter(
          (tabtime) => new Date(tabtime.startAt) > cutoffDate,
        );

        sendResponse(filteredTabtimes);
      } else {
        // Sinon on renvoie tout
        sendResponse(tabtimes);
      }
    }
    return true; // Indique qu'on utilisera sendResponse de manière asynchrone
  });
};

export default tabtimes;
