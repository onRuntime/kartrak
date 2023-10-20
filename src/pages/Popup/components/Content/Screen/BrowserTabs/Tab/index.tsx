import React from 'react';
import styled from 'styled-components';
import { extractDomainFromUrl } from '../../../../../utils/__layout';
import { RiWindowLine } from 'react-icons/ri';

export type BrowserTabProps = {
  id?: number;
  favicon?: string;
  name?: string;
  url?: string;
};

const BrowserTab: React.FC<BrowserTabProps> = ({
  id,
  favicon,
  name,
  url,
}: BrowserTabProps) => {
  return (
    <Container onClick={() => chrome.tabs.update(id || 0, { active: true })}>
      {favicon ? (
        <Favicon src={favicon} alt={name} width={8} height={8} />
      ) : (
        <RiWindowLine size={8} />
      )}
      <Name>{name || ''}</Name>
      <Url>{`- ${extractDomainFromUrl(url || '')}`}</Url>
      <Time>{'5m'}</Time>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  color: #909090;
  gap: 3px;
  padding: 5px 7px;
  background-color: #faf7f7;
  border-radius: 3.5px;
  cursor: pointer;
`;

const Favicon = styled.img`
  width: 8px;
  height: 8px;
  border-radius: 2px;
`;

const Name = styled.span`
  font-size: 8px;
  font-weight: 600;
  color: #014335;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 130px;
`;

const Url = styled.span`
  font-size: 8px;
  color: inherit;
`;

const Time = styled.span`
  font-size: 8px;
  font-weight: 600;
  color: #909090;
  margin-left: auto;
`;

export default BrowserTab;
