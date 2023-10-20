import React from 'react';
import styled from 'styled-components';
import Tabs from './Tabs';
import DateTime from './DateTime';
import Report from './Report';
import BrowserTabs from './BrowserTabs';

const Content: React.FC = () => {
  return (
    <Container>
      <Tabs />
      <DateTime />
      <Report />
      <BrowserTabs />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  gap: 10px;
  border-bottom: 1px solid #dedede;
`;

export default Content;
