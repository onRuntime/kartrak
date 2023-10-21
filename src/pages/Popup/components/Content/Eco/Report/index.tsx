import React from 'react';
import styled from 'styled-components';
import ReportCard from './Card';
import { RiCloudLine, RiContrastDrop2Line, RiStackLine } from 'react-icons/ri';

const Report = () => {
  return (
    <Container>
      <Description>Votre empreinte écologique pour cette visite :</Description>
      <Content>
        <ReportCard
          title={
            <>
              <RiContrastDrop2Line size={18} />
              <br />
              2,45cl
            </>
          }
          description={
            <>
              consommation d'eau bleue
            </>
          }
        />
        <ReportCard
          title={
            <>
              <RiCloudLine size={18} />
              <br />
              0,67g
            </>
          }
          description={
            <>
              émission de gaz à effet de serre
            </>
          }
        />
        <ReportCard
          title={
            <>
              <RiStackLine size={18} />
              <br />
              2,05Mo
            </>
          }
          description={
            <>
              poids de la page visitée
            </>
          }
        />
      </Content>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Content = styled.div`
  display: flex;
  gap: 7px;
`;

const Description = styled.span`
  font-size: 13px;
  color: #909090;
`;

export default Report;
