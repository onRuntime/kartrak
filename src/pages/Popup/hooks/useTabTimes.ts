import React from "react";

import { TabTimesContext } from "../context/TabTimes";

const useTabTimes = () => {
  // Use the useContext hook to access the context
  const tabtimes = React.useContext(TabTimesContext);
  return tabtimes;
};

export default useTabTimes;
