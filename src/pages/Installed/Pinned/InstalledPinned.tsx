import React from "react";
import styled from "styled-components";

import Button from "../../../components/ui/Button";
import GlobalStyle from "../../../components/ui/GlobalStyle";

const InstalledPinnedPage: React.FC = () => {
  return (
    <Container>
      <GlobalStyle />

      <Title>{"Vous êtes prêt à y aller !"}</Title>

      <TextContent>
        {
          "Epinglez dès maintenant l’extension à la barre d’outils de votre navigateur. Vous serez amenés à ouvrir souvent l’extension, alors ça sera plus pratique !"
        }
      </TextContent>

      <PinValidButton>{"J'ai épinglé l'extension"}</PinValidButton>
    </Container>
  );
};

const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-family: "neulis-cursive";
  font-size: 48px;
  font-weight: 600;
  text-align: center;
  color: var(--primary);
`;

const TextContent = styled.p`
  margin-top: 15px;
  text-align: center;

  color: var(--grey);
  font-size: 18px;
`;

const PinValidButton = styled(Button)`
  margin-top: 40px;
`;

export default InstalledPinnedPage;
