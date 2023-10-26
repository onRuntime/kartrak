import React from "react";

import Tracking from "./Tracking";
import { TabTimesProvider } from "./context/TabTimes";
import GlobalStyle from "../../components/ui/GlobalStyle";

const Popup: React.FC = () => {
  return (
    <TabTimesProvider>
      <GlobalStyle />
      <Tracking />
    </TabTimesProvider>
  );
};

export default Popup;
