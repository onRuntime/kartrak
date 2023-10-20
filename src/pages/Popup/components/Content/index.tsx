import React from 'react';
import styled from 'styled-components';
import Tabs from './Tabs';
import Eco from './Eco';
import { useLocalStorage } from 'usehooks-ts';
import Screen from './Screen';

export enum TabType {
  Eco = 'eco',
  Screen = 'screen',
}

const Content: React.FC = () => {
  const [tab, setTab] = useLocalStorage<TabType>('tab', TabType.Eco);

  return (
    <Container>
      <Tabs tab={tab} setTab={setTab} />
      {tab === 'eco' ? <Eco /> : <Screen />}
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
