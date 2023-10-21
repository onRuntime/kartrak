import React from 'react';
import BrowserTabs from './BrowserTabs';
import ScreenTime from './ScreenTime';
import { TabTime } from '../../../../../types';
import { getTabtimes } from '../../../../../utils/bridge';

const Screen: React.FC = () => {
  const [tabtimes, setTabtimes] = React.useState<TabTime[]>([]);

  React.useEffect(() => {
    chrome.tabs.query({ currentWindow: true }, async function (t) {
      setTabtimes(await getTabtimes());
    });

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
      if (changeInfo.status === 'complete') {
        chrome.tabs.query({ currentWindow: true }, async function (t) {
          setTabtimes(await getTabtimes());
        });
      }
    });

    chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
      chrome.tabs.query({ currentWindow: true }, async function (t) {
        setTabtimes(await getTabtimes());
      });
    });
  }, []);

  return (
    <>
      <ScreenTime tabtimes={tabtimes} />
      <BrowserTabs tabtimes={tabtimes} />
    </>
  );
};

export default Screen;
