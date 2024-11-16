import React from "react";
import styled, { keyframes } from "styled-components";

import { TabTime } from "../../../../../../types";
import { useChromeStorage } from "../../../../context/ChromeStorage";
import { useChromeTabs } from "../../../../hooks/useChromeTabs";
import {
  extractDomainFromUrl,
  getFormattedTime,
} from "../../../../utils/__collection";

const UPDATE_INTERVAL = 1000;

const ActivitySkeleton = () => (
  <Container>
    <Name>
      {"Temps d'activité : "}
      <SkeletonText width={"120px"} height={"13px"} />
    </Name>
    <SkeletonText width={"80px"} height={"18px"} />
  </Container>
);

const Activity: React.FC = () => {
  const { activeTab } = useChromeTabs();
  const domain = extractDomainFromUrl(activeTab?.url || "");

  const { data: tabtimes, isLoading } = useChromeStorage<TabTime[]>(
    "tabtimes",
    {
      area: "local",
      ttl: 5 * 60 * 1000,
      fallback: [],
    },
  );

  // Filtrer les tabtimes pour le domaine actuel
  const domainTabtimes = React.useMemo(() => {
    return tabtimes.filter(
      (tabtime) => extractDomainFromUrl(tabtime.url) === domain,
    );
  }, [tabtimes, domain]);

  // État pour le temps formaté et l'état de chargement initial
  const [formattedTime, setFormattedTime] = React.useState<string | null>(null);

  // Effet pour mettre à jour le temps
  React.useEffect(() => {
    const interval = setInterval(() => {
      const newTime = getFormattedTime(domainTabtimes);
      if (newTime !== formattedTime) {
        setFormattedTime(newTime);
      }
    }, UPDATE_INTERVAL);

    // Initialisation immédiate
    setFormattedTime(getFormattedTime(domainTabtimes));

    return () => clearInterval(interval);
  }, [domainTabtimes, formattedTime]);

  // Effet pour réinitialiser le temps lors du changement de domaine
  React.useEffect(() => {
    setFormattedTime(null);
  }, [domain]);

  if (isLoading || formattedTime === null) {
    return <ActivitySkeleton />;
  }

  return (
    <Container>
      <Name>
        {"Temps d'activité : "}
        <span>{domain}</span>
      </Name>
      <Time>{formattedTime}</Time>
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
