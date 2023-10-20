import React from 'react';
import styled from 'styled-components';

const DateTime: React.FC = () => {
  return (
    <Container>
      <Name>
        Temps d'activité :<span>onRuntime Studio</span>
      </Name>
      <Time>3h 20min</Time>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Name = styled.span`
  display: inline-flex;
  flex-direction: column;
  font-size: 13px;
  font-weight: 600;
  color: #909090;

  span {
    font-size: 13px;
    font-weight: 600;
    color: #014335;
  }
`;

const Time = styled.span`
  font-size: 18px;
  font-weight: 600;
  font-family: 'neulis-cursive';
  color: #014335;
`;

export default DateTime;
