import React from "react";
import styled from "styled-components";

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
  width: calc(33.3% - 7px);
  display: flex;
  background-color: var(--current-ecoindex-background-color, #f1faf1);
  color: #909090;
  padding: 10px 10px;
  flex-direction: column;
  border-radius: 3.45px;
  margin-left: 7px;
  margin-top: 7px;
`;

const Title = styled.span`
  font-size: 20px;
  font-weight: 600;
  font-family: "neulis-cursive";
  color: var(--current-ecoindex-color, #009245);

  svg {
    vertical-align: middle;
  }
`;

const Description = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: #014335;
`;

export default ReportCard;
