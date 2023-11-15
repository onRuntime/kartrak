import React from "react";
import styled from "styled-components";

import Activity from "./Activity";
import Report from "./Report";
import Score from "./Score";
import { Analyze } from "../../../../../types";
import { getChromeLocalStorage } from "../../../../../utils/asyncChromeStorage";
import { cleanUrl } from "../../../../../utils/url";
import { computeEcoIndex } from "../../../utils/__collection";

const Eco: React.FC = () => {
  const [tab, setTab] = React.useState<chrome.tabs.Tab>();
  React.useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setTab(tabs[0]);
    });

    chrome.tabs.onActivated.addListener((activeInfo) => {
      chrome.tabs.get(activeInfo.tabId, (tab) => {
        setTab(tab);
      });
    });

    chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
      if (changeInfo.status === "complete") {
        setTab(tab);
      }
    });

    chrome.tabs.onCreated.addListener((tab) => {
      setTab(tab);
    });

    chrome.tabs.onRemoved.addListener((_tabId, _removeInfo) => {
      setTab(undefined);
    });
  }, []);

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
        {"Envie d’en savoir plus?"}{" "}
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

const getCurrentEcoIndexColor = (ecoIndex?: number) => {
  if (ecoIndex === undefined) {
    return "var(--primary)";
  }

  if (ecoIndex >= 75) {
    return "var(--green)";
  }

  if (ecoIndex >= 50) {
    return "var(--yellow)";
  }

  if (ecoIndex >= 25) {
    return "var(--orange)";
  }

  return "var(--red)";
};

const getCurrentEcoIndexBackgroundColor = (ecoIndex?: number) => {
  if (ecoIndex === undefined) {
    return "var(--green-10)";
  }

  if (ecoIndex >= 75) {
    return "var(--green-80)";
  }

  if (ecoIndex >= 50) {
    return "var(--yellow-80)";
  }

  if (ecoIndex >= 25) {
    return "var(--orange-80)";
  }

  return "var(--red-80)";
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
