import React from 'react';
import styled from 'styled-components';
import {
  extractDomainFromUrl,
  getFormattedTime,
} from '../../../../utils/__layout';
import useTabTimes from '../../../../hooks/useTabTimes';

const DateTime: React.FC = () => {
  const [tab, setTab] = React.useState<chrome.tabs.Tab>();
  const domain = extractDomainFromUrl(tab?.url || '');

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

  const tabtimes = useTabTimes().filter(
    (tab) => extractDomainFromUrl(tab.url) === domain
  );
  const [formattedTime, setFormattedTime] = React.useState<string>();
  React.useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const updateFormattedTime = () => {
      setFormattedTime(getFormattedTime(tabtimes));
    };

    // Update the formatted time every second (1000ms)
    intervalId = setInterval(updateFormattedTime, 1000);

    // Clear the interval when the component unmounts
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [tabtimes]);

  return (
    <Container>
      <Name>
        Temps d'activité : <span>{domain}</span>
      </Name>
      <Time>{formattedTime ? formattedTime : getFormattedTime(tabtimes)}</Time>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Name = styled.span`
  display: inline-flex;
  flex-direction: column;
  font-size: 13px;
  font-weight: 600;
  color: #909090;

  span {
    font-size: 13px;
    font-weight: 600;
    color: #014335;
  }
`;

const Time = styled.span`
  font-size: 18px;
  font-weight: 600;
  font-family: 'neulis-cursive';
  color: #014335;
`;

export default DateTime;
