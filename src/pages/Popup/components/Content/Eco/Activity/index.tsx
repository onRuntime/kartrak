import React from 'react';
import styled from 'styled-components';
import {
  extractDomainFromUrl,
  getFormattedTime,
} from '../../../../utils/__collection';
import useTabTimes from '../../../../hooks/useTabTimes';

export type ActivityProps = {
  tab?: chrome.tabs.Tab;
};

const Activity: React.FC<ActivityProps> = ({ tab }: ActivityProps) => {
  const domain = extractDomainFromUrl(tab?.url || '');

  const tabtimes = useTabTimes().filter(
    (tab) => extractDomainFromUrl(tab.url) === domain
  );
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
      <Name>
        Temps d'activité : <span>{domain}</span>
      </Name>
      <Time>{formattedTime ? formattedTime : getFormattedTime(tabtimes)}</Time>
    </Container>
  );
};

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
  }
`;

const Time = styled.span`
  font-size: 18px;
  font-weight: 600;
  font-family: 'neulis-cursive';
  color: #014335;
`;

export default Activity;
