import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import styled from "styled-components";

import { Analyze } from "../../../../../../types";
import { getEcoIndexGrade } from "../../../../../../utils/ecoindex";
import { useChromeTabs } from "../../../../hooks/useChromeTabs";
import {
  extractDomainFromUrl,
  getEcoIndexText,
  getSmileyType,
} from "../../../../utils/__collection";
dayjs.extend(relativeTime);

export type ScoreProps = {
  analyze?: Analyze;
  ecoIndex?: number;
};

const Score: React.FC<ScoreProps> = ({ analyze, ecoIndex }: ScoreProps) => {
  const { activeTab } = useChromeTabs();
  const domain = extractDomainFromUrl(activeTab?.url || "");

  return (
    <Container>
      <EcoIndex>
        <Smiley
          src={require(
            `../../../../../../assets/img/smileys/${getSmileyType(
              ecoIndex,
            )}.svg`,
          )}
          alt={getSmileyType(ecoIndex)}
          draggable={false}
        />
        <Note>
          {ecoIndex ? Math.round(ecoIndex) : "-"}
          {"/100"}
        </Note>
      </EcoIndex>
      <Content>
        <Title>
          {ecoIndex ? getEcoIndexText(ecoIndex) : ""}
          {" Cette page de "}
          {domain} {"est classée “"}
          {ecoIndex ? getEcoIndexGrade(ecoIndex) : "-"}
          {"”"}
        </Title>
        <Description>
          {"Calculé la dernière fois le :"}{" "}
          {analyze ? dayjs(analyze.updatedAt).fromNow() : "-"}
        </Description>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 0;
  gap: 10px;
`;

const Smiley = styled.img`
  height: 50px;
  width: 50px;
`;

const EcoIndex = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const Note = styled.div`
  font-size: 36px;
  font-weight: 600;
  color: var(--current-ecoindex-color, #009245);
  font-family: "neulis-cursive";
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: var(--current-ecoindex-color, #014335);
`;

const Description = styled.div`
  font-size: 13px;
  color: #909090;
`;

export default Score;
