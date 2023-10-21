import React from 'react';
import styled from 'styled-components';
import useTabTimes from '../../../../hooks/useTabTimes';
import { extractDomainFromUrl } from '../../../../utils/__layout';
import dayjs from 'dayjs';

const DomainTime: React.FC = () => {
  // const tabtimes = useTabTimes().map((tabtime) => {
  //   if (!tabtime.endAt) {
  //     tabtime.endAt = new Date().toISOString();
  //   }
  //   return tabtime;
  // });
  // const domainMap = new Map<string, number>();

  // tabtimes.map(async (tabtime) => {
  //   const totalTabtime =
  //     domainMap.get(extractDomainFromUrl(tabtime.url) || '') || 0;

  //   domainMap.set(
  //     extractDomainFromUrl(tabtime.url) || '',
  //     totalTabtime +
  //       dayjs(new Date(tabtime.endAt as string)).diff(
  //         dayjs(new Date(tabtime.startAt as string))
  //       )
  //   );
  // });

  // console.log(domainMap);

  return <Container></Container>;
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export default DomainTime;
