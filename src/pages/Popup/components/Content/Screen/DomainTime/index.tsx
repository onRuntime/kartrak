import dayjs from "dayjs";
import React from "react";
import styled from "styled-components";

import DomainItem, { DomainItemSkeleton } from "./DomainItem";
import { TabTime } from "../../../../../../types";
import { useChromeStorage } from "../../../../context/ChromeStorage";
import { extractDomainFromUrl } from "../../../../utils/__collection";

const ITEMS_TO_SHOW = 4;

const DomainTime: React.FC = () => {
  const { data: tabtimes, isLoading } = useChromeStorage<TabTime[]>(
    "tabtimes",
    {
      area: "local",
      ttl: 5 * 60 * 1000,
      fallback: [],
    },
  );

  const [domainMap, setDomainMap] = React.useState<
    Map<
      string,
      {
        time: number;
        favIconUrl?: string;
      }
    >
  >(new Map());

  const getSortedDomainMap = React.useCallback((tabtimes: TabTime[]) => {
    const domainMap = new Map<
      string,
      {
        time: number;
        favIconUrl?: string;
      }
    >();

    const processedTabtimes = tabtimes.map((tabtime) => ({
      ...tabtime,
      endAt: tabtime.endAt || new Date().toISOString(),
    }));

    processedTabtimes.forEach((tabtime) => {
      const domain = extractDomainFromUrl(tabtime.url) || "";
      const existingDomainData = domainMap.get(domain);

      const timeSpent = dayjs(new Date(tabtime.endAt as string)).diff(
        dayjs(new Date(tabtime.startAt)),
      );

      if (existingDomainData) {
        existingDomainData.time += timeSpent;
        domainMap.set(domain, existingDomainData);
      } else {
        domainMap.set(domain, {
          time: timeSpent,
          favIconUrl: tabtime.favIconUrl,
        });
      }
    });

    return new Map(
      Array.from(domainMap.entries()).sort((a, b) => b[1].time - a[1].time),
    );
  }, []);

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const updateDomainMap = () => {
      setDomainMap(getSortedDomainMap(tabtimes));
    };

    updateDomainMap();
    intervalId = setInterval(updateDomainMap, 1000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [getSortedDomainMap, tabtimes]);

  if (isLoading) {
    return (
      <Container>
        {Array.from({ length: ITEMS_TO_SHOW }).map((_, index) => (
          <DomainItemSkeleton key={index} />
        ))}
      </Container>
    );
  }

  const sortedDomains = Array.from(domainMap.entries())
    .slice(0, ITEMS_TO_SHOW)
    .map(([domain, { time, favIconUrl }]) => (
      <DomainItem
        key={domain}
        domain={domain}
        time={time}
        favIconUrl={favIconUrl}
      />
    ));

  return (
    <Container>
      {sortedDomains.length > 0 ? (
        sortedDomains
      ) : (
        <EmptyMessage>{"Aucune donnée disponible"}</EmptyMessage>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #909090;
  font-size: 13px;
  padding: 8px 0;
`;

export default React.memo(DomainTime);
