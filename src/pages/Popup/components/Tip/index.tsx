import React from "react";
import { RiCloseLine, RiRefreshLine } from "react-icons/ri";
import styled from "styled-components";

import {
  getChromeSessionStorage,
  setChromeSessionStorage,
} from "../../../../utils/asyncChromeStorage";
import tips from "../../data/tips";
import { getRandomNumber } from "../../utils/__collection";

const Tip: React.FC = () => {
  const [isTip, setIsTip] = React.useState<boolean>();
  const [tipKey, setTipKey] = React.useState<number>();

  React.useEffect(() => {
    const handler = async () => {
      const isTip = await getChromeSessionStorage<boolean>("isTip");
      if (isTip !== undefined) {
        setIsTip(isTip);
      } else {
        await setChromeSessionStorage("isTip", true);
        setIsTip(true);
      }

      const tipKey = await getChromeSessionStorage<number>("tipKey");
      if (tipKey !== undefined) {
        setTipKey(tipKey);
      } else {
        const tipKey = getRandomNumber(0, tips.length - 1);
        await setChromeSessionStorage("tipKey", tipKey);
        setTipKey(tipKey);
      }
    };

    handler();
  }, []);

  const handleSwitchTip = async () => {
    const tipKey = getRandomNumber(0, tips.length - 1);
    await setChromeSessionStorage("tipKey", tipKey);
    setTipKey(tipKey);
  };

  const handleCloseTip = async () => {
    await setChromeSessionStorage("isTip", false);
    setIsTip(false);
  };

  console.log("chrome session storage", isTip, tipKey);
  if (!isTip || tipKey === undefined) {
    return null;
  }

  return (
    <Container>
      <Header>
        <Icon
          src={require("../../../../assets/img/bulb.svg")}
          draggable={false}
          alt={""}
          width={18}
          height={18}
        />

        <Title>{"Tip & Astuce"}</Title>

        <Row>
          <RiRefreshLine size={15} onClick={handleSwitchTip} />
          <RiCloseLine size={15} onClick={handleCloseTip} />
        </Row>
      </Header>

      <Content>{tips[tipKey]}</Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 10px;
  background-color: var(--green-40, #eff8f3);
  padding: 15px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 5px;
`;

const Icon = styled.img`
  width: 18px;
  height: 18px;
`;

const Title = styled.div`
  width: 100%;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;

  svg {
    cursor: pointer;
  }
`;

const Content = styled.p`
  font-size: 13px;
  color: var(--grey);
  line-height: 1.5;
`;

export default Tip;
