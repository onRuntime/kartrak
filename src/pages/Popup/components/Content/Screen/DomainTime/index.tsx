import dayjs from "dayjs";
import React from "react";
import styled from "styled-components";

import DomainItem, { DomainItemSkeleton } from "./DomainItem";
import { TabTime } from "../../../../../../types";
import { useChromeStorage } from "../../../../context/ChromeStorage";
import { extractDomainFromUrl } from "../../../../utils/__collection";

const UPDATE_INTERVAL = 1000;
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

  const [formattedDomains, setFormattedDomains] = React.useState<
    [string, { time: number; favIconUrl?: string }][]
  >(() => {
    if (isLoading) return [];
    const initialMap = getSortedDomainMap(tabtimes);
    return Array.from(initialMap.entries()).slice(0, ITEMS_TO_SHOW);
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      const newMap = getSortedDomainMap(tabtimes);
      const newDomains = Array.from(newMap.entries()).slice(0, ITEMS_TO_SHOW);

      const isDifferent = newDomains.some((newItem, index) => {
        const currentItem = formattedDomains[index];
        return (
          !currentItem ||
          newItem[0] !== currentItem[0] ||
          newItem[1].time !== currentItem[1].time
        );
      });

      if (isDifferent) {
        setFormattedDomains(newDomains);
      }
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [tabtimes, formattedDomains, getSortedDomainMap]);

  // Effet pour initialiser les données une fois que le chargement est terminé
  React.useEffect(() => {
    if (!isLoading && formattedDomains.length === 0) {
      const initialMap = getSortedDomainMap(tabtimes);
      setFormattedDomains(
        Array.from(initialMap.entries()).slice(0, ITEMS_TO_SHOW),
      );
    }
  }, [isLoading, tabtimes, getSortedDomainMap, formattedDomains.length]);

  if (isLoading || formattedDomains.length === 0) {
    return (
      <Container>
        {Array.from({ length: ITEMS_TO_SHOW }).map((_, index) => (
          <DomainItemSkeleton key={index} />
        ))}
      </Container>
    );
  }

  return (
    <Container>
      {formattedDomains.length > 0 ? (
        formattedDomains.map(([domain, { time, favIconUrl }]) => (
          <DomainItem
            key={domain}
            domain={domain}
            time={time}
            favIconUrl={favIconUrl}
          />
        ))
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
