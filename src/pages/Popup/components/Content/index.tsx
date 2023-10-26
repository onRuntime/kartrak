import React from "react";
import styled from "styled-components";
import { useLocalStorage } from "usehooks-ts";

import Eco from "./Eco";
import Screen from "./Screen";
import Tabs from "./Tabs";

export enum TabType {
  Eco = "eco",
  Screen = "screen",
}

const Content: React.FC = () => {
  const [tab, setTab] = useLocalStorage<TabType>("tab", TabType.Eco);

  return (
    <Container>
      <Tabs tab={tab} setTab={setTab} />
      {tab === "eco" ? <Eco /> : <Screen />}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  gap: 10px;
  border: 1px solid rgba(1, 67, 53, 0.1);
  border-radius: 10px;
`;

export default Content;
