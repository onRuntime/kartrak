import React from "react";

import { TabTime } from "../../../types";
import { getTabTimes } from "../../../utils/bridge";

// Create a context for TabTime data
export const TabTimesContext = React.createContext<TabTime[]>([]);

export const TabTimesProvider: React.FC<React.PropsWithChildren> = ({
  children,
}: React.PropsWithChildren) => {
  const [tabtimes, setTabTimes] = React.useState<TabTime[]>([]);

  React.useEffect(() => {
    const updateTabTimes = async () => {
      const tabtimesData = await getTabTimes();
      setTabTimes(tabtimesData);
    };

    // Fetch tabtimes on initial render
    updateTabTimes();

    // Listen for tab updates and removal
    chrome.tabs.onUpdated.addListener((_tabId, changeInfo, _tab) => {
      if (changeInfo.status === "complete") {
        updateTabTimes();
      }
    });

    chrome.tabs.onRemoved.addListener((_tabId, _removeInfo) => {
      updateTabTimes();
    });
  }, []);

  return (
    // Provide the tabtimes data to the context
    <TabTimesContext.Provider value={tabtimes}>
      {children}
    </TabTimesContext.Provider>
  );
};
