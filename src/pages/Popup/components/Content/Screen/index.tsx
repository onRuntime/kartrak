import React from "react";

import BrowserTabs from "./BrowserTabs";
import DomainTime from "./DomainTime";
import ScreenTime from "./ScreenTime";

const Screen: React.FC = () => {
  return (
    <>
      <ScreenTime />
      <DomainTime />
      <BrowserTabs />
    </>
  );
};

export default Screen;
