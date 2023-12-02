import React from "react";
import styled from "styled-components";

import Button from "../../components/ui/Button";
import GlobalStyle from "../../components/ui/GlobalStyle";

const WelcomePage: React.FC = () => {
  const [isPinned, setIsPinned] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleCheckIfPinned = React.useCallback((shouldError = true) => {
    console.log("kartrak - check if pinned");

    const checkIfPinned = async (): Promise<boolean> => {
      const userSettings = await chrome.action.getUserSettings();

      console.log("kartrak - userSettings", userSettings);

      return userSettings.isOnToolbar;
    };

    checkIfPinned().then((isPinned) => {
      if (isPinned) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];

          if (activeTab) {
            setIsPinned(true);
          }
        });
      } else if (shouldError) {
        setError("L'extension n'est pas épinglée à la barre d'outils.");
      }
    });
  }, []);

  const handleCloseTab = React.useCallback(() => {
    console.log("kartrak - close tab");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      if (activeTab) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        chrome.tabs.remove(activeTab.id!);
      }
    });
  }, []);

  React.useEffect(() => {
    handleCheckIfPinned(false);
  }, []);

  console.log("kartrak - isPinned", isPinned);

  return (
    <Container>
      <Row>
        <GlobalStyle />

        {isPinned ? (
          <>
            <Title>{"Vous êtes prêt à y aller !"}</Title>

            <TextContent>
              {
                "Vous pouvez désormais cliquer sur l’extension quand vous le souhaitez pour analyser des sites internets ou voir vos statistiques d’activités."
              }
            </TextContent>

            <Image
              src={require("../../assets/img/welcome/opened-extension.png")}
              alt={"Extension ouverte"}
            />

            <StyledButton onClick={handleCloseTab}>
              {"J’ai compris, merci"}
            </StyledButton>
          </>
        ) : (
          <>
            <Title>
              {"Kartrak est désormais installé sur votre navigateur"}
            </Title>

            <TextContent>
              {
                "Épinglez dès maintenant l’extension à la barre d’outils de votre navigateur. Vous serez amenés à ouvrir souvent l’extension, alors ça sera plus pratique !"
              }
            </TextContent>

            <Image
              src={require("../../assets/img/welcome/extension-pinned.png")}
              alt={"Extension épinglée"}
            />

            <StyledButton onClick={() => handleCheckIfPinned()}>
              {"J'ai épinglé l'extension"}
            </StyledButton>

            {error && <Error>{error}</Error>}
          </>
        )}
      </Row>
    </Container>
  );
};

const Container = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 750px;
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

const Image = styled.img`
  margin-top: 40px;
  max-width: 560px;
  width: 100%;
`;

const StyledButton = styled(Button)`
  margin-top: 40px;
`;

const Error = styled.p`
  margin-top: 10px;
  color: var(--red);
`;

export default WelcomePage;
