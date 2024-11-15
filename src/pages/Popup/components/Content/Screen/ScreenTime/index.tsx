import React from "react";
import styled from "styled-components";
import { useLocalStorage } from "usehooks-ts";

import useTabTimes from "../../../../hooks/useTabTimes";
import { Range } from "../../../../types";
import { getDateRange, getFormattedTime } from "../../../../utils/__collection";

const REFRESH_INTERVAL = 1000; // Rafraîchir toutes les secondes au lieu d'utiliser requestAnimationFrame

const ScreenTime: React.FC = () => {
  const tabtimes = useTabTimes();
  const [range, setRange] = useLocalStorage<Range>("range", Range.Day);
  const [formattedTime, setFormattedTime] = React.useState<string>();

  React.useEffect(() => {
    // Utiliser un intervalle fixe au lieu de requestAnimationFrame
    const interval = setInterval(() => {
      const dateRange = getDateRange(range);
      const newTime = getFormattedTime(tabtimes, dateRange);
      if (newTime !== formattedTime) {
        setFormattedTime(newTime);
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [tabtimes, range, formattedTime]);

  const dateRange = React.useMemo(() => getDateRange(range), [range]);
  const initialTime = React.useMemo(
    () => getFormattedTime(tabtimes, dateRange),
    [tabtimes, dateRange],
  );

  return (
    <Container>
      <Time>{formattedTime || initialTime}</Time>
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

export default React.memo(ScreenTime);
