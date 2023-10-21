import React from 'react';
import GlobalStyle from '../../components/ui/GlobalStyle';
import Tracking from './Tracking';
import { TabTimesProvider } from './context/TabTimes';

const Popup: React.FC = () => {
  return (
    <TabTimesProvider>
      <GlobalStyle />
      <Tracking />
    </TabTimesProvider>
  );
};

export default Popup;
