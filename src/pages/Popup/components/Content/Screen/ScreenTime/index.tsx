import React from "react";
import styled from "styled-components";
import { useLocalStorage } from "usehooks-ts";

import useTabTimes from "../../../../hooks/useTabTimes";
import { DateRange, Range } from "../../../../types";
import { getFormattedTime } from "../../../../utils/__collection";

export const getDateRange = (range: Range): DateRange => {
  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (range) {
    case Range.Day:
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 1);
      endDate = new Date(now);
      break;

    case Range.Week:
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      endDate = new Date(now);
      break;

    case Range.Month:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;

    case Range.Year:
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
      break;

    default:
      throw new Error(`Invalid range: ${range}`);
  }

  return [startDate.toISOString(), endDate.toISOString()];
};

const ScreenTime: React.FC = () => {
  const tabtimes = useTabTimes();
  const [range, setRange] = useLocalStorage<Range>("range", Range.Day);

  const [formattedTime, setFormattedTime] = React.useState<string>();

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const updateFormattedTime = () => {
      setFormattedTime(getFormattedTime(tabtimes, getDateRange(range)));
    };

    // Update the formatted time every second (1000ms)
    intervalId = setInterval(updateFormattedTime, 1000);

    // Clear the interval when the component unmounts
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [tabtimes]);

  return (
    <Container>
      <Time>
        {formattedTime
          ? formattedTime
          : getFormattedTime(tabtimes, getDateRange(range))}
      </Time>
      <RangeSelect
        value={range}
        onChange={(e) => setRange(e.target.value as Range)}
      >
        <option value={Range.Day}>{"Aujourd'hui"}</option>
        <option value={Range.Week}>{"Cette semaine"}</option>
        <option value={Range.Month}>{"Ce mois-ci"}</option>
        <option value={Range.Year}>{"Cette année"}</option>
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

export default ScreenTime;
