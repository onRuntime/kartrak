import React from "react";
import { RiInformationLine } from "react-icons/ri";
import styled from "styled-components";

import Content from "./components/Content";
import Header from "./components/Header";
import Tip from "./components/Tip";

const Tracking: React.FC = () => {
  return (
    <Container>
      <Header />
      <Content />
      <Tip />
      <Help>
        <a
          href={"https://discord.gg/ucX9c5yXmX"}
          target={"_blank"}
          rel={"noopener noreferrer"}
        >
          {"Besoin d'aide "}
          <RiInformationLine size={18} />
        </a>
      </Help>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
`;

const Help = styled.div`
  font-size: 13px;
  text-align: right;

  a {
    color: var(--primary);
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
`;

export default Tracking;
