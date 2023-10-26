import React from "react";
import styled from "styled-components";

import BrowserTab from "./Tab";
import { cleanUrl } from "../../../../../../utils/url";
import useTabTimes from "../../../../hooks/useTabTimes";

const BrowserTabs: React.FC = () => {
  const [tabs, setTabs] = React.useState<chrome.tabs.Tab[]>([]);
  const tabtimes = useTabTimes();

  React.useEffect(() => {
    chrome.tabs.query({ currentWindow: true }, async function (t) {
      setTabs(t);
    });

    chrome.tabs.onUpdated.addListener(function (_tabId, changeInfo, _tab) {
      if (changeInfo.status === "complete") {
        chrome.tabs.query({ currentWindow: true }, async function (t) {
          setTabs(t);
        });
      }
    });

    chrome.tabs.onRemoved.addListener(function (_tabId, _removeInfo) {
      chrome.tabs.query({ currentWindow: true }, async function (t) {
        setTabs(t);
      });
    });
  }, []);

  return (
    <Container>
      <Title>
        {"Onglets actifs - "}
        {tabs.length}
      </Title>
      <Row>
        {tabs.map((tab) => {
          return (
            <BrowserTab
              key={tab.id}
              tab={tab}
              tabtimes={tabtimes.filter(
                (t) => cleanUrl(t.url) === cleanUrl(tab.url || ""),
              )}
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
  gap: 3.5px;
`;

const Title = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #014335;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3.5px;
`;

export default BrowserTabs;
