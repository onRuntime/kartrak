import React from 'react';
import styled from 'styled-components';

const Tabs: React.FC = () => {
  return (
    <Container>
      <Tab active>Empreinte eco'</Tab>
      <Tab>Temps d’écran</Tab>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  padding: 5px;
  gap: 7px;
  border: 1px solid #eff8f3;
  border-radius: 99999px;
`;

const Tab = styled.button<{ active?: boolean }>`
  font-size: 10px;
  font-weight: 600;
  padding: 5px 7px;
  border: none;
  border-radius: 99999px;
  cursor: pointer;
  background-color: ${({ active }) => (active ? '#cce9dA' : 'transparent')};
  color: ${({ active }) => (active ? '#009245' : 'inherit')};
`;

export default Tabs;
