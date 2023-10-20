import React from 'react';
import styled from 'styled-components';

const ScreenTime: React.FC = () => {
  return (
    <Container>
      <Time>37h 26min</Time>
      <RangeSelect>
        <option value="day">Aujourd'hui</option>
        <option value="week">Cette semaine</option>
        <option value="month">Ce mois-ci</option>
        <option value="year">Cette année</option>
      </RangeSelect>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Time = styled.span`
  font-size: 20px;
  font-family: 'neulis-cursive';
  font-weight: 600;
  color: #014335;
`;

const RangeSelect = styled.select`
  font-size: 10px;
  font-weight: 600;
  color: #909090;
  border: none;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
`;

export default ScreenTime;
