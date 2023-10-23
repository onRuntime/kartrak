import React from 'react';
import styled from 'styled-components';
import { Analyze } from '../../../../../../types';
import {
  extractDomainFromUrl,
  getEcoIndexGrade,
} from '../../../../utils/__collection';

export enum SmileyType {
  Happy = 'happy',
  Good = 'good',
  Sad = 'sad',
  Smile = 'smile',
}

export type ScoreProps = {
  analyze?: Analyze;
  ecoIndex?: number;
  tab?: chrome.tabs.Tab;
};

const Score: React.FC<ScoreProps> = ({
  analyze,
  ecoIndex,
  tab,
}: ScoreProps) => {
  const domain = extractDomainFromUrl(tab?.url || '');
  return (
    <Container>
      <EcoIndex>
        <Smiley
          src={require(`../../../../../../assets/img/smileys/${SmileyType.Happy}.svg`)}
          alt={SmileyType.Happy}
          draggable={false}
        />
        <Note>{ecoIndex ? Math.round(ecoIndex) : '-'}/100</Note>
      </EcoIndex>
      <Content>
        <Title>
          Youpi! {domain} est classé “
          {ecoIndex ? getEcoIndexGrade(ecoIndex) : '-'}”
        </Title>
        <Description>Calculé la dernière fois le : 18/10/2023</Description>
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
  color: #009245;
  font-family: 'neulis-cursive';
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
  color: #014335;
`;

const Description = styled.div`
  font-size: 13px;
  color: #909090;
`;

export default Score;
