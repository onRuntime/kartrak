import React from 'react';
import Header from './components/Header';
import Content from './components/Content';
import styled from 'styled-components';
import Tip from './components/Tip';

const Tracking: React.FC = () => {
  return (
    <Container>
      <Header />
      <Content />
      <Tip />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
`;

export default Tracking;
