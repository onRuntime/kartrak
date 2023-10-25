import React from 'react';
import styled from 'styled-components';
import useTabTimes from '../../../../hooks/useTabTimes';
import dayjs from 'dayjs';
import { extractDomainFromUrl } from '../../../../utils/__collection';
import DomainItem from './DomainItem';

const DomainTime: React.FC = () => {
  const tabtimes = useTabTimes().map((tabtime) => {
    if (!tabtime.endAt) {
      tabtime.endAt = new Date().toISOString();
    }
    return tabtime;
  });
  const domainMap = new Map<
    string,
    {
      time: number;
      favIconUrl?: string;
    }
  >();

  tabtimes.map(async (tabtime) => {
    const domain = extractDomainFromUrl(tabtime.url) || '';
    const existingDomainData = domainMap.get(domain);

    if (existingDomainData) {
      // If data exists for the domain, update the time property
      existingDomainData.time += dayjs(new Date(tabtime.endAt as string)).diff(
        dayjs(new Date(tabtime.startAt as string))
      );

      // Set the updated data back in the map
      domainMap.set(domain, existingDomainData);
    } else {
      // If no data exists for the domain, create a new object and add it to the map
      domainMap.set(domain, {
        time: dayjs(new Date(tabtime.endAt as string)).diff(
          dayjs(new Date(tabtime.startAt as string))
        ),
        favIconUrl: tabtime.favIconUrl,
      });
    }
  });

  const sortedDomainMap = new Map(
    Array.from(domainMap.entries()).sort((a, b) => b[1].time - a[1].time)
  );

  console.log('domainMap', sortedDomainMap);

  return (
    <Container>
      {Array.from(sortedDomainMap.entries())
        .slice(0, 4)
        .map(([domain, { time, favIconUrl }]) => {
          return (
            <DomainItem
              key={domain}
              domain={domain}
              time={time}
              favIconUrl={favIconUrl}
            />
          );
        })}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export default DomainTime;
