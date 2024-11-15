import React from "react";
import styled, { keyframes } from "styled-components";

import useTabTimes from "../../../../hooks/useTabTimes";
import {
  extractDomainFromUrl,
  getFormattedTime,
} from "../../../../utils/__collection";

const UPDATE_INTERVAL = 1000;

export type ActivityProps = {
  tab?: chrome.tabs.Tab;
};

const ActivitySkeleton = () => (
  <Container>
    <Name>
      {"Temps d'activité : "}
      <SkeletonText width={"120px"} height={"13px"} />
    </Name>
    <SkeletonText width={"80px"} height={"18px"} />
  </Container>
);

const Activity: React.FC<ActivityProps> = ({ tab }) => {
  const domain = extractDomainFromUrl(tab?.url || "");
  const { tabtimes, isLoading } = useTabTimes();
  const [currentTime, setCurrentTime] = React.useState<string>("");

  const domainTabtimes = React.useMemo(
    () => tabtimes.filter((tab) => extractDomainFromUrl(tab.url) === domain),
    [tabtimes, domain],
  );

  React.useEffect(() => {
    const updateTime = () => {
      const formatted = getFormattedTime(domainTabtimes);
      setCurrentTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [domainTabtimes]);

  if (isLoading) {
    return <ActivitySkeleton />;
  }

  return (
    <Container>
      <Name>
        {"Temps d'activité : "}
        <span>{domain}</span>
      </Name>
      <Time>{currentTime}</Time>
    </Container>
  );
};

// Animation de pulse pour le skeleton
const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

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
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 100%;
  }
`;

const Time = styled.span`
  font-size: 18px;
  font-weight: 600;
  font-family: "neulis-cursive";
  color: #014335;
  white-space: nowrap;
`;

const SkeletonText = styled.div<{ width: string; height: string }>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: #e2e8f0;
  border-radius: 3px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

export default React.memo(Activity);
