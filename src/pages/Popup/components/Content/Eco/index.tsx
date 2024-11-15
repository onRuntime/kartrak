import React from "react";
import styled from "styled-components";

import Activity from "./Activity";
import Report from "./Report";
import Score from "./Score";
import { Analyze } from "../../../../../types";
import { getChromeLocalStorage } from "../../../../../utils/chromeStorage";
import {
  computeEcoIndex,
  getCurrentEcoIndexBackgroundColor,
  getCurrentEcoIndexColor,
} from "../../../../../utils/ecoindex";
import { cleanUrl } from "../../../../../utils/url";

const Eco: React.FC = () => {
  const [tab, setTab] = React.useState<chrome.tabs.Tab>();
  const [currentWindowId, setCurrentWindowId] = React.useState<number>();

  // Get and store the current window ID
  React.useEffect(() => {
    chrome.windows.getCurrent((window) => {
      setCurrentWindowId(window.id);
    });

    // Update currentWindowId when window focus changes
    chrome.windows.onFocusChanged.addListener((windowId) => {
      if (windowId !== chrome.windows.WINDOW_ID_NONE) {
        setCurrentWindowId(windowId);
      }
    });
  }, []);

  React.useEffect(() => {
    const updateTabForCurrentWindow = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          setTab(tabs[0]);
        }
      });
    };

    // Initial tab state
    updateTabForCurrentWindow();

    // Handle tab activation
    chrome.tabs.onActivated.addListener((activeInfo) => {
      chrome.windows.get(activeInfo.windowId, (window) => {
        // Only update if the activation happened in current window
        if (window.id === currentWindowId) {
          chrome.tabs.get(activeInfo.tabId, (tab) => {
            setTab(tab);
          });
        }
      });
    });

    // Handle tab updates
    chrome.tabs.onUpdated.addListener((_tabId, changeInfo, updatedTab) => {
      if (
        changeInfo.status === "complete" &&
        updatedTab.windowId === currentWindowId
      ) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id === updatedTab.id) {
            setTab(updatedTab);
          }
        });
      }
    });

    // Handle tab creation
    chrome.tabs.onCreated.addListener((newTab) => {
      if (newTab.windowId === currentWindowId) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id === newTab.id) {
            setTab(newTab);
          }
        });
      }
    });

    // Handle tab removal
    chrome.tabs.onRemoved.addListener((removedTabId, removeInfo) => {
      if (removeInfo.windowId === currentWindowId && tab?.id === removedTabId) {
        setTab(undefined);
      }
    });

    // Handle window focus change
    chrome.windows.onFocusChanged.addListener((windowId) => {
      if (windowId !== chrome.windows.WINDOW_ID_NONE) {
        updateTabForCurrentWindow();
      }
    });
  }, [currentWindowId, tab?.id]);

  const getAnalyze = async () => {
    const analyzes = (await getChromeLocalStorage("analyzes")) as Analyze[];

    const tabs = await new Promise<chrome.tabs.Tab[]>((resolve) =>
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        resolve,
      ),
    );
    const tab = tabs[0];
    if (!tab) {
      return;
    }

    const analyze = analyzes.find(
      (analyze) => cleanUrl(analyze.url) === cleanUrl(tab.url || ""),
    );
    if (!analyze) {
      return;
    }

    return analyze;
  };

  const [analyze, setAnalyze] = React.useState<Analyze>();

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const initializeAnalyze = async () => {
      const analyze = await getAnalyze();
      setAnalyze(analyze);
    };

    const updateAnalyze = async () => {
      const analyze = await getAnalyze();
      setAnalyze(analyze);
    };

    initializeAnalyze();
    intervalId = setInterval(updateAnalyze, 1000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const ecoIndex =
    analyze?.domSize !== undefined &&
    analyze?.pageWeight !== undefined &&
    analyze?.requestAmount !== undefined
      ? computeEcoIndex(
          analyze?.domSize,
          analyze?.pageWeight,
          analyze?.requestAmount,
        )
      : undefined;

  return (
    <Container ecoIndex={ecoIndex}>
      <Activity tab={tab} />
      <Score analyze={analyze} ecoIndex={ecoIndex} tab={tab} />
      <Report analyze={analyze} ecoIndex={ecoIndex} />

      <About>
        {"Envie d'en savoir plus?"}{" "}
        <a
          href={
            "https://www.ecoindex.fr/comment-ca-marche?utm_source=kartrak&utm_medium=extension&utm_campaign=kartrak"
          }
          target={"_blank"}
          rel={"noopener noreferrer"}
        >
          {"Cliquez ici"}
        </a>
      </About>
    </Container>
  );
};

const Container = styled.div<{
  ecoIndex?: number;
}>`
  --current-ecoindex-color: ${({ ecoIndex }) =>
    `${getCurrentEcoIndexColor(ecoIndex)}`};
  --current-ecoindex-background-color: ${({ ecoIndex }) =>
    `${getCurrentEcoIndexBackgroundColor(ecoIndex)}`};

  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const About = styled.div`
  font-size: 13px;
  color: #909090;
  text-align: center;

  a {
    color: #009245;
    font-weight: 600;
  }
`;

export default Eco;
