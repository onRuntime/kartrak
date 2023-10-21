import React from 'react';
import styled from 'styled-components';

const DomainItem = () => {
  return (
    <Container>
      <Favicon>DomainItem</Favicon>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: 5px;
`;

const Favicon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 5px;
  background-color: #014335;
`;

export default DomainItem;
