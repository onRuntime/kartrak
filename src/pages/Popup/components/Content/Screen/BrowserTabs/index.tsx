import React from 'react';
import styled from 'styled-components';
import BrowserTab from './Tab';

const BrowserTabs = () => {
  const [tabs, setTabs] = React.useState<chrome.tabs.Tab[]>([]);
  React.useEffect(() => {
    chrome.tabs.query({ currentWindow: true }, function (t) {
      setTabs(t);
    });

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
      if (changeInfo.status === 'complete') {
        chrome.tabs.query({ currentWindow: true }, function (t) {
          setTabs(t);
        });
      }
    });

    chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
      chrome.tabs.query({ currentWindow: true }, function (t) {
        setTabs(t);
      });
    });
  }, []);

  return (
    <Container>
      <Title>Onglets actifs - {tabs.length}</Title>
      <Row>
        {tabs.map((tab) => {
          console.log(tab);
          return (
            <BrowserTab
              key={tab.id}
              favicon={tab.favIconUrl}
              name={tab.title}
              url={tab.url}
            />
          );
        })}
      </Row>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Title = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #014335;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default BrowserTabs;
