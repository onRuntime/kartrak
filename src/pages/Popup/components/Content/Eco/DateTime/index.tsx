import React from 'react';
import styled from 'styled-components';

const DateTime: React.FC = () => {
  return (
    <Container>
      <Date>Aujourd’hui, 19 oct. 2023</Date>
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

const Date = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: #909090;
`;

const Time = styled.span`
  font-size: 13px;
  font-weight: 600;
`;

export default DateTime;
