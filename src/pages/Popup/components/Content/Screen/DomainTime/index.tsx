import dayjs from "dayjs";
import React from "react";
import styled from "styled-components";

import DomainItem from "./DomainItem";
import { TabTime } from "../../../../../../types";
import useTabTimes from "../../../../hooks/useTabTimes";
import { extractDomainFromUrl } from "../../../../utils/__collection";

const DomainTime: React.FC = () => {
  const tabtimes = useTabTimes().map((tabtime) => {
    if (!tabtime.endAt) {
      tabtime.endAt = new Date().toISOString();
    }
    return tabtime;
  });

  const [domainMap, setDomainMap] = React.useState<
    Map<
      string,
      {
        time: number;
        favIconUrl?: string;
      }
    >
  >();

  const getSortedDomainMap = React.useCallback((tabtimes: TabTime[]) => {
    const domainMap = new Map<
      string,
      {
        time: number;
        favIconUrl?: string;
      }
    >();

    tabtimes.map(async (tabtime) => {
      const domain = extractDomainFromUrl(tabtime.url) || "";
      const existingDomainData = domainMap.get(domain);

      if (existingDomainData) {
        // If data exists for the domain, update the time property
        existingDomainData.time += dayjs(
          new Date(tabtime.endAt as string),
        ).diff(dayjs(new Date(tabtime.startAt as string)));

        // Set the updated data back in the map
        domainMap.set(domain, existingDomainData);
      } else {
        // If no data exists for the domain, create a new object and add it to the map
        domainMap.set(domain, {
          time: dayjs(new Date(tabtime.endAt as string)).diff(
            dayjs(new Date(tabtime.startAt as string)),
          ),
          favIconUrl: tabtime.favIconUrl,
        });
      }
    });

    const sortedDomainMap = new Map(
      Array.from(domainMap.entries()).sort((a, b) => b[1].time - a[1].time),
    );

    return sortedDomainMap;
  }, []);

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const updateDomainMap = () => {
      setDomainMap(getSortedDomainMap(tabtimes));
    };

    // Update the formatted time every second (1000ms)
    intervalId = setInterval(updateDomainMap, 1000);

    // Clear the interval when the component unmounts
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [getSortedDomainMap, tabtimes]);

  return (
    <Container>
      {Array.from((domainMap || getSortedDomainMap(tabtimes)).entries())
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
