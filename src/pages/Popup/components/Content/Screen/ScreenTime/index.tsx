import React from "react";
import styled, { keyframes } from "styled-components";
import { useLocalStorage } from "usehooks-ts";

import { TabTime } from "../../../../../../types";
import { useChromeStorage } from "../../../../context/ChromeStorage";
import { Range } from "../../../../types";
import { getDateRange, getFormattedTime } from "../../../../utils/__collection";

const UPDATE_INTERVAL = 1000;

const ScreenTimeSkeleton = () => (
  <Container>
    <SkeletonText width={"120px"} height={"23px"} />
    <SkeletonText width={"100px"} height={"13px"} />
  </Container>
);

const ScreenTime: React.FC = () => {
  const { data: tabtimes, isLoading } = useChromeStorage<TabTime[]>(
    "tabtimes",
    {
      area: "local",
      ttl: 5 * 60 * 1000,
      fallback: [],
    },
  );
  const [range, setRange] = useLocalStorage<Range>("range", Range.Day);

  const dateRange = React.useMemo(() => getDateRange(range), [range]);

  // État pour le temps formaté avec null comme valeur initiale
  const [formattedTime, setFormattedTime] = React.useState<string | null>(null);

  // Effet pour mettre à jour le temps
  React.useEffect(() => {
    const interval = setInterval(() => {
      const newTime = getFormattedTime(tabtimes, dateRange);
      if (newTime !== formattedTime) {
        setFormattedTime(newTime);
      }
    }, UPDATE_INTERVAL);

    // Initialisation immédiate
    setFormattedTime(getFormattedTime(tabtimes, dateRange));

    return () => clearInterval(interval);
  }, [tabtimes, dateRange, formattedTime]);

  // Effet pour réinitialiser le temps lors du changement de range
  React.useEffect(() => {
    setFormattedTime(null);
  }, [range]);

  if (isLoading || formattedTime === null) {
    return <ScreenTimeSkeleton />;
  }

  return (
    <Container>
      <Time>{formattedTime}</Time>
      <RangeSelect
        value={range}
        onChange={(e) => setRange(e.target.value as Range)}
      >
        <option value={Range.Day}>{"24 dernières heures"}</option>
        <option value={Range.Week}>{"7 derniers jours"}</option>
        <option value={Range.Month}>{"30 derniers jours"}</option>
        <option value={Range.Year}>{"365 derniers jours"}</option>
      </RangeSelect>
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

const Time = styled.span`
  font-size: 23px;
  font-family: "neulis-cursive";
  font-weight: 600;
  color: #014335;
`;

const RangeSelect = styled.select`
  font-size: 13px;
  font-weight: 600;
  color: #909090;
  border: none;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
`;

const SkeletonText = styled.div<{ width: string; height: string }>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: #e2e8f0;
  border-radius: 3px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

export default React.memo(ScreenTime);
