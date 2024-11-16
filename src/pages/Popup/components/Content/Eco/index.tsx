import React from "react";
import styled from "styled-components";

import Activity from "./Activity";
import Report from "./Report";
import Score from "./Score";
import { Analyze } from "../../../../../types";
import {
  computeEcoIndex,
  getCurrentEcoIndexBackgroundColor,
  getCurrentEcoIndexColor,
} from "../../../../../utils/ecoindex";
import { cleanUrl } from "../../../../../utils/url";
import { useChromeStorage } from "../../../context/ChromeStorage";
import { useChromeTabs } from "../../../hooks/useChromeTabs";

const Eco: React.FC = () => {
  const { activeTab } = useChromeTabs();

  const { data: analyzes } = useChromeStorage<Analyze[]>("analyzes", {
    area: "local",
    ttl: 5 * 60 * 1000,
    fallback: [],
  });

  const analyze = analyzes.find(
    (analyze) => cleanUrl(analyze.url) === cleanUrl(activeTab?.url || ""),
  );

  const ecoIndex =
    analyze?.domSize !== undefined &&
    analyze?.pageWeight !== undefined &&
    analyze?.requestAmount !== undefined
      ? computeEcoIndex(
          analyze?.domSize,
          analyze?.requestAmount,
          analyze?.pageWeight,
        )
      : undefined;

  return (
    <Container ecoIndex={ecoIndex}>
      <Activity />
      <Score analyze={analyze} ecoIndex={ecoIndex} />
      <Report analyze={analyze} ecoIndex={ecoIndex} />

      <About>
        {"Envie d'en savoir plus?"}{" "}
        <a
          href={
            "https://www.ecoindex.fr/comment-ca-marche?utm_source=kartrak&utm_medium=extension&utm_campaign=kartrak"
          }
          target={"_blank"}
          rel={"noopener noreferrer"}
        >
          {"Cliquez ici"}
        </a>
      </About>
    </Container>
  );
};

const Container = styled.div<{
  ecoIndex?: number;
}>`
  --current-ecoindex-color: ${({ ecoIndex }) =>
    `${getCurrentEcoIndexColor(ecoIndex)}`};
  --current-ecoindex-background-color: ${({ ecoIndex }) =>
    `${getCurrentEcoIndexBackgroundColor(ecoIndex)}`};

  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const About = styled.div`
  font-size: 13px;
  color: #909090;
  text-align: center;

  a {
    color: #009245;
    font-weight: 600;
  }
`;

export default Eco;
