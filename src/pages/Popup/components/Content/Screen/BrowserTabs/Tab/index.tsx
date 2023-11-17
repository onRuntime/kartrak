import React from "react";
import { RiWindowLine } from "react-icons/ri";
import styled from "styled-components";

import { TabTime } from "../../../../../../../types";
import {
  extractDomainFromUrl,
  getFormattedTime,
} from "../../../../../utils/__collection";

export type BrowserTabProps = {
  tab: chrome.tabs.Tab;
  tabtimes: TabTime[];
};

const BrowserTab: React.FC<BrowserTabProps> = ({
  tab,
  tabtimes,
}: BrowserTabProps) => {
  const [formattedTime, setFormattedTime] = React.useState<string>();

  React.useEffect(() => {
    let animationFrameId: number | null = null;

    const updateFormattedTime = () => {
      setFormattedTime(getFormattedTime(tabtimes));
      animationFrameId = requestAnimationFrame(updateFormattedTime);
    };

    // Update the formatted time every second (1000ms)
    animationFrameId = requestAnimationFrame(updateFormattedTime);

    // Clear the interval when the component unmounts
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [tabtimes]);

  return (
    <Container
      onClick={() => chrome.tabs.update(tab.id || 0, { active: true })}
      active={tab.active}
    >
      {tab.favIconUrl ? (
        <Favicon src={tab.favIconUrl} alt={tab.title} width={10} height={10} />
      ) : (
        <RiWindowLine size={8} />
      )}
      <Name>{tab.title}</Name>
      <Url>{`- ${extractDomainFromUrl(tab.url || "")}`}</Url>
      <Time>{formattedTime ? formattedTime : getFormattedTime(tabtimes)}</Time>
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
`;

const Favicon = styled.img`
  width: 10px;
  height: 10px;
  border-radius: 2px;
`;

const Name = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #014335;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 130px;
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
