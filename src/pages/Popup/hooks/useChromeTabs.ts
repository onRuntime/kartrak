import { useState, useEffect, useCallback } from "react";

// Chrome Tab Types
type ChromeTab = chrome.tabs.Tab;
type TabChangeInfo = chrome.tabs.TabChangeInfo;
type TabRemoveInfo = chrome.tabs.TabRemoveInfo;
type TabMoveProperties = chrome.tabs.MoveProperties;
type TabCreateProperties = chrome.tabs.CreateProperties;
type TabUpdateProperties = chrome.tabs.UpdateProperties;

export const useChromeTabs = () => {
  const [tabs, setTabs] = useState<ChromeTab[]>([]);
  const [activeTab, setActiveTab] = useState<ChromeTab | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  // Fetch all tabs in current window
  const getAllTabs = useCallback(async () => {
    try {
      const chromeTabs = await chrome.tabs.query({ currentWindow: true });
      setTabs(chromeTabs);
      return chromeTabs;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      return [];
    }
  }, []);

  // Get current active tab
  const getCurrentTab = useCallback(async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      setActiveTab(tab);
      return tab;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      return undefined;
    }
  }, []);

  // Create new tab
  const createTab = useCallback(
    async (options: TabCreateProperties = {}) => {
      try {
        const newTab = await chrome.tabs.create(options);
        await getAllTabs();
        return newTab;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        return undefined;
      }
    },
    [getAllTabs],
  );

  // Update existing tab
  const updateTab = useCallback(
    async (tabId: number, updateProperties: TabUpdateProperties) => {
      try {
        const updatedTab = await chrome.tabs.update(tabId, updateProperties);
        await getAllTabs();
        return updatedTab;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        return undefined;
      }
    },
    [getAllTabs],
  );

  // Close tab by ID
  const closeTab = useCallback(
    async (tabId: number) => {
      try {
        await chrome.tabs.remove(tabId);
        await getAllTabs();
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        return false;
      }
    },
    [getAllTabs],
  );

  // Move tab to new position
  const moveTab = useCallback(
    async (tabId: number, moveProperties: TabMoveProperties) => {
      try {
        const movedTab = await chrome.tabs.move(tabId, moveProperties);
        await getAllTabs();
        return movedTab;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        return undefined;
      }
    },
    [getAllTabs],
  );

  // Listen for tab updates
  useEffect(() => {
    const updateListener = async (
      _tabId: number,
      changeInfo: TabChangeInfo,
      _tab: ChromeTab,
    ) => {
      if (changeInfo.status === "complete") {
        await getAllTabs();
      }
    };

    const removeListener = async (
      _tabId: number,
      _removeInfo: TabRemoveInfo,
    ) => {
      await getAllTabs();
    };

    const createListener = async (_tab: ChromeTab) => {
      await getAllTabs();
    };

    // Add listeners
    chrome.tabs.onUpdated.addListener(updateListener);
    chrome.tabs.onRemoved.addListener(removeListener);
    chrome.tabs.onCreated.addListener(createListener);

    // Initial fetch
    getAllTabs();
    getCurrentTab();

    // Cleanup listeners
    return () => {
      chrome.tabs.onUpdated.removeListener(updateListener);
      chrome.tabs.onRemoved.removeListener(removeListener);
      chrome.tabs.onCreated.removeListener(createListener);
    };
  }, [getAllTabs, getCurrentTab]);

  return {
    tabs,
    activeTab,
    error,
    getAllTabs,
    getCurrentTab,
    createTab,
    updateTab,
    closeTab,
    moveTab,
  };
};
