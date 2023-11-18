import React from "react";
import { useLocalStorage } from "usehooks-ts";

import BrowserTabs from "./BrowserTabs";
import ScreenTime from "./ScreenTime";
import ScreenTimeChart from "./ScreenTimeChart";
import { Range } from "../../../types";

const Screen: React.FC = () => {
  const [range, setRange] = useLocalStorage<Range>("range", Range.Day);
  return (
    <>
      <ScreenTime range={range} setRange={setRange} />
      {/* <DomainTime /> */}
      <ScreenTimeChart range={range} />
      <BrowserTabs />
    </>
  );
};

export default Screen;
