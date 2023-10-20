import React from 'react';
import styled from 'styled-components';
import ReportCard from './Card';
import { RiCloudLine, RiContrastDrop2Line } from 'react-icons/ri';

const Report = () => {
  return (
    <Container>
      <ReportCard
        title={
          <>
            <RiContrastDrop2Line size={12} /> 2,45cl
          </>
        }
        description={
          <>
            consommation
            <br />
            d'eau bleue
          </>
        }
      />
      <ReportCard
        title={
          <>
            <RiCloudLine size={12} /> 0,67g
          </>
        }
        description={
          <>
            émission de gaz
            <br />à effet de serre
          </>
        }
      />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  gap: 7px;
`;

export default Report;
