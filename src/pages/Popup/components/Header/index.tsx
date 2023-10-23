import React from 'react';
import styled from 'styled-components';
import logo from '../../../../assets/img/logo.svg';
import manifestJson from '../../../../manifest.json';

const Header: React.FC = () => {
  return (
    <Container>
      <BrandContainer>
        <BrandImage src={logo} width={32} height={32} />
      </BrandContainer>
      <Content>
        <Title>Kartrak - Tracking carbone & activité</Title>
        <Description>
          Alpha{' '}
          {(manifestJson as any).version
            ? `v${(manifestJson as any).version}`
            : 'development mode'}
        </Description>
      </Content>
    </Container>
  );
};

const Container = styled.header`
  padding: 10px 5px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const BrandContainer = styled.div`
  display: flex;
  align-items: center;
`;

const BrandImage = styled.img``;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 15px;
  font-weight: 600;
  color: #014335;
  font-family: 'neulis-cursive';
`;

const Description = styled.p`
  font-size: 11px;
  color: #909090;
  font-weight: 500;
`;

export default Header;