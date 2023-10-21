import React from 'react';
import BrowserTabs from './BrowserTabs';
import ScreenTime from './ScreenTime';

const Screen: React.FC = () => {
  return (
    <>
      <ScreenTime />
      <BrowserTabs />
    </>
  );
};

export default Screen;
