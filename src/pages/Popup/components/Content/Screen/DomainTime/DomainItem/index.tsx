import React from "react";
import styled from "styled-components";

import { formatTime } from "../../../../../utils/__collection";

export type DomainItemProps = {
  domain: string;
  time: number;
  favIconUrl?: string;
};

const DomainItem: React.FC<DomainItemProps> = ({
  domain,
  time,
  favIconUrl,
}: DomainItemProps) => {
  return (
    <Container>
      <Favicon>
        {favIconUrl && (
          <img
            src={favIconUrl}
            alt={`Favicon for ${domain}`}
            width={15}
            height={15}
          />
        )}
      </Favicon>
      <Name>{domain}</Name>
      <Time>{formatTime(time)}</Time>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Favicon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 5px;
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Name = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
`;

const Time = styled.span`
  margin-left: auto;
  font-size: 13px;
  font-weight: 500;
  color: var(--primary);
`;

export default DomainItem;
