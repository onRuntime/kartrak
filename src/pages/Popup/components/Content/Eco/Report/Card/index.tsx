import React from 'react';
import styled from 'styled-components';

export type ReportCardProps = {
  title: React.ReactNode | string;
  description: React.ReactNode | string;
};

const ReportCard: React.FC<ReportCardProps> = ({
  title,
  description,
}: ReportCardProps) => {
  return (
    <Container>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  background-color: #faf7f7;
  color: #909090;
  padding: 7px 10px;
  flex-direction: column;
  border-radius: 3.45px;
`;

const Title = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: inherit;

  svg {
    vertical-align: middle;
  }
`;

const Description = styled.span`
  font-size: 9px;
  font-weight: 500;
  color: inherit;
`;

export default ReportCard;
