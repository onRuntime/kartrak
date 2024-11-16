import React from "react";
import styled, { keyframes } from "styled-components";

import BrowserTab from "./Tab";
import { TabTime } from "../../../../../../types";
import { cleanUrl } from "../../../../../../utils/url";
import { useChromeStorage } from "../../../../context/ChromeStorage";

const SKELETON_TABS_COUNT = 3;

const BrowserTabsSkeleton = () => (
  <Container>
    <Title>
      <SkeletonText width={"150px"} height={"14px"} />
    </Title>
    <Row>
      {Array.from({ length: SKELETON_TABS_COUNT }).map((_, index) => (
        <SkeletonTab key={index} />
      ))}
    </Row>
  </Container>
);

// Création d'un tab skeleton minimal
const SkeletonTab = () => (
  <SkeletonContainer>
    <SkeletonCircle />
    <SkeletonContent>
      <SkeletonText width={"130px"} height={"12px"} />
      <SkeletonDash>{"-"}</SkeletonDash>
      <SkeletonText width={"100px"} height={"12px"} />
    </SkeletonContent>
    <SkeletonText
      width={"35px"}
      height={"12px"}
      style={{ marginLeft: "auto" }}
    />
  </SkeletonContainer>
);

const BrowserTabs: React.FC = () => {
  const { data: tabtimes, isLoading } = useChromeStorage<TabTime[]>(
    "tabtimes",
    {
      area: "local",
      ttl: 5 * 60 * 1000,
      fallback: [],
    },
  );

  const [tabs, setTabs] = React.useState<chrome.tabs.Tab[]>([]);
  const [isTabsLoading, setIsTabsLoading] = React.useState(true);

  React.useEffect(() => {
    const updateTabs = async () => {
      setIsTabsLoading(true);
      try {
        const newTabs = await chrome.tabs.query({ currentWindow: true });
        setTabs(newTabs);
      } finally {
        setIsTabsLoading(false);
      }
    };

    updateTabs();

    const handleTabUpdate = (
      _tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
    ) => {
      if (changeInfo.status === "complete") {
        updateTabs();
      }
    };

    chrome.tabs.onUpdated.addListener(handleTabUpdate);
    chrome.tabs.onRemoved.addListener(updateTabs);

    return () => {
      chrome.tabs.onUpdated.removeListener(handleTabUpdate);
      chrome.tabs.onRemoved.removeListener(updateTabs);
    };
  }, []);

  const tabTimesByUrl = React.useMemo(() => {
    const map = new Map();
    tabs.forEach((tab) => {
      const url = cleanUrl(tab.url || "");
      map.set(
        url,
        tabtimes.filter((t) => cleanUrl(t.url) === url),
      );
    });
    return map;
  }, [tabs, tabtimes]);

  if (isLoading || isTabsLoading) {
    return <BrowserTabsSkeleton />;
  }

  return (
    <Container>
      <Title>
        {"Onglets actifs - "}
        {tabs.length}
      </Title>
      <Row>
        {tabs.map((tab) => (
          <BrowserTab
            key={tab.id}
            tab={tab}
            tabtimes={tabTimesByUrl.get(cleanUrl(tab.url || "")) || []}
          />
        ))}
      </Row>
    </Container>
  );
};

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

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

const SkeletonContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 5px 7px;
  background-color: var(--grey-20, #faf7f7);
  border-radius: 3.5px;
`;

const SkeletonContent = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
  align-items: center;
  gap: 3px;
`;

const SkeletonText = styled.div<{ width: string; height: string }>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: #e2e8f0;
  border-radius: 3px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const SkeletonCircle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #e2e8f0;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const SkeletonDash = styled.span`
  font-size: 12px;
  color: #909090;
`;

export default React.memo(BrowserTabs);
