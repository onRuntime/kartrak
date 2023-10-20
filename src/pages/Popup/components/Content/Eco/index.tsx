import React from 'react';
import Activity from './Activity';
import Report from './Report';
import Score from './Score';
import styled from 'styled-components';

const Eco: React.FC = () => {
  return (
    <>
      <Activity />
      <Score />
      <Report />

      <About>
        Envie d’en savoir plus?{' '}
        <a
          href={'https://onruntime.com'}
          target="_blank"
          rel="noopener noreferrer"
        >
          Cliquez ici
        </a>
      </About>
    </>
  );
};

const About = styled.div`
  font-size: 13px;
  color: #909090;

  a {
    color: #009245;
    font-weight: 600;
  }
`;

export default Eco;
