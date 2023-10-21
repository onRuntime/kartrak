import React from 'react';
import styled from 'styled-components';
import { extractDomainFromUrl } from '../../../../utils/__layout';

const DateTime: React.FC = () => {
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

  return (
    <Container>
      <Name>
        Temps d'activité : <span>{extractDomainFromUrl(tab?.url || '')}</span>
      </Name>
      <Time>3h 20min</Time>
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
