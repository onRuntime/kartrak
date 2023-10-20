import React from 'react';
import Header from './components/Header';
import Content from './components/Content';
import styled from 'styled-components';

const Tracking: React.FC = () => {
  return (
    <Container>
      <Header />
      <Content />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

export default Tracking;
