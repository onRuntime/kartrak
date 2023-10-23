import React from 'react';
import Activity from './Activity';
import Report from './Report';
import Score from './Score';
import styled from 'styled-components';
import { Analyze } from '../../../../../types';
import { getChromeLocalStorage } from '../../../../Background/utils/asyncChromeLocalStorage';
import { computeEcoIndex } from '../../../utils/__collection';

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

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete') {
        setTab(tab);
      }
    });

    chrome.tabs.onCreated.addListener((tab) => {
      setTab(tab);
    });

    chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
      setTab(undefined);
    });
  }, []);

  const getAnalyze = async () => {
    const analyzes = (await getChromeLocalStorage('analyzes')) as Analyze[];

    const tabs = await new Promise<chrome.tabs.Tab[]>((resolve) =>
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        resolve
      )
    );
    const tab = tabs[0];
    if (!tab) {
      return;
    }

    const analyze = analyzes.find((analyze) => analyze.url === tab.url);
    console.log('analyze', analyze, tab.url, analyzes.length);
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

  console.log(
    'analyze',
    'domSize',
    !!analyze?.domSize,
    'pageWeight',
    !!analyze?.pageWeight,
    'requestAmount',
    !!analyze?.requestAmount
  );

  const ecoIndex =
    analyze?.domSize && analyze?.pageWeight && analyze?.requestAmount
      ? computeEcoIndex(
          analyze?.domSize,
          analyze?.pageWeight,
          analyze?.requestAmount
        )
      : undefined;

  return (
    <>
      <Activity tab={tab} />
      <Score analyze={analyze} ecoIndex={ecoIndex} tab={tab} />
      <Report analyze={analyze} ecoIndex={ecoIndex} />

      <About>
        Envie d’en savoir plus?{' '}
        <a
          href={'https://onruntime.com'}
          target="_blank"
          rel="noopener noreferrer"
        >
          Cliquez ici
        </a>
      </About>
    </>
  );
};

const About = styled.div`
  font-size: 13px;
  color: #909090;

  a {
    color: #009245;
    font-weight: 600;
  }
`;

export default Eco;
