import React from "react";
import styled from "styled-components";
import useSWR from "swr";

import logo from "../../../../assets/img/logo.svg";
import { fetcher } from "../../utils/__collection";

const Header: React.FC = () => {
  const { data } = useSWR("/manifest.json", fetcher);

  return (
    <Container>
      <BrandContainer>
        <BrandImage src={logo} width={32} height={32} />
      </BrandContainer>
      <Content>
        <Title>{"Kartrak - Tracking carbone & activité"}</Title>
        <Description>
          {"Alpha"} {data && data.version ? `v${data.version}` : ""}
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
  font-family: "neulis-cursive";
`;

const Description = styled.p`
  font-size: 11px;
  color: #909090;
  font-weight: 500;
`;

export default Header;
