import React from "react";
import styled from "styled-components";

import Button from "../../components/ui/Button";
import GlobalStyle from "../../components/ui/GlobalStyle";

const InstalledPage: React.FC = () => {
  const handleCheckIfPinned = () => {
    console.log("kartrak - check if pinned");

    const checkIfPinned = async (): Promise<boolean> => {
      const userSettings = await chrome.action.getUserSettings();

      console.log("kartrak - userSettings", userSettings);

      return userSettings.isOnToolbar;
    };

    checkIfPinned().then((isPinned) => {
      console.log("kartrak - isPinned", isPinned);

      if (isPinned) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];

          if (activeTab) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            chrome.tabs.update(activeTab.id!, {
              url: "/installed/verified.html",
            });
          }
        });
      }
    });
  };

  return (
    <Container>
      <GlobalStyle />

      <Title>{"Kartrak est désormais installé sur votre navigateur"}</Title>

      <TextContent>
        {
          "Epinglez dès maintenant l’extension à la barre d’outils de votre navigateur. Vous serez amenés à ouvrir souvent l’extension, alors ça sera plus pratique !"
        }
      </TextContent>

      <PinValidButton onClick={handleCheckIfPinned}>
        {"J'ai épinglé l'extension"}
      </PinValidButton>
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

export default InstalledPage;
