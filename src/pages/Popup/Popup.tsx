import React from "react";

import Tracking from "./Tracking";
import { ChromeStorageProvider } from "./context/ChromeStorage";
import GlobalStyle from "../../components/ui/GlobalStyle";

const Popup: React.FC = () => {
  return (
    <ChromeStorageProvider>
      <GlobalStyle />
      <Tracking />
    </ChromeStorageProvider>
  );
};

export default Popup;
