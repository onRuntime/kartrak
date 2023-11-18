import React from "react";
import styled from "styled-components";

import useTabTimes from "../../../../hooks/useTabTimes";
import { Range } from "../../../../types";
import { getDateRange, getFormattedTime } from "../../../../utils/__collection";

export type ScreenTimeProps = {
  range: Range;
  setRange: (range: Range) => void;
};

const ScreenTime: React.FC<ScreenTimeProps> = ({
  range,
  setRange,
}: ScreenTimeProps) => {
  const tabtimes = useTabTimes();
  const [formattedTime, setFormattedTime] = React.useState<string>();

  React.useEffect(() => {
    let animationFrameId: number | null = null;

    const updateFormattedTime = () => {
      setFormattedTime(getFormattedTime(tabtimes, getDateRange(range)));
      animationFrameId = requestAnimationFrame(updateFormattedTime);
    };

    animationFrameId = requestAnimationFrame(updateFormattedTime);
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [tabtimes, range]);

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
