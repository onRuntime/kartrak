import React from "react";

import { TabTime } from "../../../types";
import { getTabTimes } from "../../../utils/chromeBridge";

interface TabTimesContextValue {
  tabtimes: TabTime[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export const TabTimesContext = React.createContext<TabTimesContextValue>({
  tabtimes: [],
  isLoading: false,
  error: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refresh: async () => {},
});

export const TabTimesProvider: React.FC<React.PropsWithChildren> = ({
  children,
}: React.PropsWithChildren) => {
  const [tabtimes, setTabTimes] = React.useState<TabTime[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const fetchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const fetchTabTimes = React.useCallback(async () => {
    try {
      const data = await getTabTimes();

      // Vérifier si les données ont changé avant de mettre à jour
      const stringifiedNewData = JSON.stringify(data);
      const stringifiedCurrentData = JSON.stringify(tabtimes);

      if (stringifiedNewData !== stringifiedCurrentData) {
        console.log(
          "[kartrak][popup][tabtime] context updating tabtimes:",
          data,
        );
        setTabTimes(data);
      }
    } catch (err) {
      console.error("[kartrak][popup][tabtime] error fetching tabtimes:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [tabtimes]);

  // Gérer les messages du content script et du background
  React.useEffect(() => {
    const messageHandler = (
      message: any,
      _sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void,
    ) => {
      if (
        message.action === "analyzeUpdated" ||
        message.action === "tabTimesUpdated"
      ) {
        console.log(
          "[kartrak][popup][tabtime] context received update message:",
          message.action,
        );

        // Attendre un peu que les données soient bien sauvegardées
        if (fetchTimeoutRef.current) {
          clearTimeout(fetchTimeoutRef.current);
        }

        fetchTimeoutRef.current = setTimeout(() => {
          fetchTabTimes();
          fetchTimeoutRef.current = null;
        }, 100);

        sendResponse({ received: true });
      }
    };

    chrome.runtime.onMessage.addListener(messageHandler);

    return () => {
      chrome.runtime.onMessage.removeListener(messageHandler);
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [fetchTabTimes]);

  // Gérer les changements de tab et d'état
  React.useEffect(() => {
    const handleTabUpdate = (
      _tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
    ) => {
      // Attendre la fin du chargement pour récupérer les données à jour
      if (changeInfo.status === "complete") {
        // Attendre que le content script ait fini de mettre à jour les données
        setTimeout(fetchTabTimes, 500);
      }
    };

    const handleTabRemoved = () => {
      fetchTabTimes();
    };

    const handleStateChanged = (_newState: chrome.idle.IdleState) => {
      fetchTabTimes();
    };

    // Setup listeners
    chrome.tabs.onUpdated.addListener(handleTabUpdate);
    chrome.tabs.onRemoved.addListener(handleTabRemoved);
    chrome.idle.onStateChanged.addListener(handleStateChanged);

    // Chargement initial
    fetchTabTimes();

    // Cleanup
    return () => {
      chrome.tabs.onUpdated.removeListener(handleTabUpdate);
      chrome.tabs.onRemoved.removeListener(handleTabRemoved);
      chrome.idle.onStateChanged.removeListener(handleStateChanged);
    };
  }, [fetchTabTimes]);

  const value = React.useMemo(
    () => ({
      tabtimes,
      isLoading,
      error,
      refresh: fetchTabTimes,
    }),
    [tabtimes, isLoading, error, fetchTabTimes],
  );

  return (
    <TabTimesContext.Provider value={value}>
      {children}
    </TabTimesContext.Provider>
  );
};
