import React from 'react';
import styled from 'styled-components';
import { TabTime } from '../../../../../../types';
import { useLocalStorage } from 'usehooks-ts';
import { getFormattedTime } from '../../../../utils/__collection';
import useTabTimes from '../../../../hooks/useTabTimes';

export enum Range {
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

const ScreenTime: React.FC = () => {
  const tabtimes = useTabTimes();
  const [range, setRange] = useLocalStorage<Range>('range', Range.Day);

  const [formattedTime, setFormattedTime] = React.useState<string>();

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const updateFormattedTime = () => {
      setFormattedTime(getFormattedTime(tabtimes));
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
      <Time>{formattedTime ? formattedTime : getFormattedTime(tabtimes)}</Time>
      <RangeSelect
        value={range}
        onChange={(e) => setRange(e.target.value as Range)}
      >
        <option value={Range.Day}>Aujourd'hui</option>
        <option value={Range.Week}>Cette semaine</option>
        <option value={Range.Month}>Ce mois-ci</option>
        <option value={Range.Year}>Cette année</option>
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
  font-family: 'neulis-cursive';
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
