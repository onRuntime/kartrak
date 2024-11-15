import React from "react";
import { RiWindowLine } from "react-icons/ri";
import styled from "styled-components";

import { TabTime } from "../../../../../../../types";
import { getFormattedTime } from "../../../../../utils/__collection";

const UPDATE_INTERVAL = 1000; // 1 seconde

export type BrowserTabProps = {
  tab: chrome.tabs.Tab;
  tabtimes: TabTime[];
  cachedUrl?: string;
};

const BrowserTab: React.FC<BrowserTabProps> = ({
  tab,
  tabtimes,
  cachedUrl,
}: BrowserTabProps) => {
  const [formattedTime, setFormattedTime] = React.useState(() =>
    getFormattedTime(tabtimes)
  );

  // Memoize le titre et l'URL pour éviter les recalculs
  const { displayTitle, displayUrl } = React.useMemo(() => {
    const url = cachedUrl || tab.url || "";
    return {
      displayTitle: tab.title || "Sans titre",
      displayUrl: url
        .replace(/^.*?:\/\//, "")
        .replace(/^(www\.)?/, "")
        .replace(/\/$/, ""),
    };
  }, [tab.title, cachedUrl, tab.url]);

  React.useEffect(() => {
    // Utiliser setInterval au lieu de requestAnimationFrame
    const interval = setInterval(() => {
      const newTime = getFormattedTime(tabtimes);
      if (newTime !== formattedTime) {
        setFormattedTime(newTime);
      }
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [tabtimes, formattedTime]);

  const handleClick = React.useCallback(() => {
    if (tab.id) {
      chrome.tabs.update(tab.id, { active: true });
    }
  }, [tab.id]);

  // Optimisation du rendu de l'icône
  const renderIcon = React.useMemo(() => {
    if (tab.favIconUrl) {
      return (
        <Favicon
          src={tab.favIconUrl}
          alt={displayTitle}
          width={10}
          height={10}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.style.display = "none";
            // Afficher l'icône par défaut en cas d'erreur
            const defaultIcon = document.createElement("span");
            defaultIcon.innerHTML = "<RiWindowLine size={10} />";
            img.parentNode?.appendChild(defaultIcon);
          }}
        />
      );
    }
    return <RiWindowLine size={10} />;
  }, [tab.favIconUrl, displayTitle]);

  return (
    <Container onClick={handleClick} active={tab.active}>
      {renderIcon}
      <Content>
        <Name title={displayTitle}>{displayTitle}</Name>
        <Url title={displayUrl}>{`- ${displayUrl}`}</Url>
      </Content>
      <Time>{formattedTime}</Time>
    </Container>
  );
};

const Container = styled.div<{ active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  color: #909090;
  gap: 3px;
  padding: 5px 7px;
  background-color: ${({ active }) =>
    active ? "var(--green-80, #cce9da)" : "var(--grey-20, #faf7f7)"};
  border-radius: 3.5px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ active }) =>
      active ? "var(--green-80, #cce9da)" : "var(--grey-30, #f0f0f0)"};
  }
`;

const Favicon = styled.img`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  object-fit: contain;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
  align-items: center;
  gap: 3px;
`;

const Name = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #014335;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 130px;
  flex-shrink: 0;
`;

const Url = styled.span`
  font-size: 12px;
  color: inherit;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 100%;
`;

const Time = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #909090;
  margin-left: auto;
  white-space: nowrap;
`;

export default React.memo(BrowserTab);
