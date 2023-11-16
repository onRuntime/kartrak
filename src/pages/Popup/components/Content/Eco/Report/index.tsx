import React from "react";
import {
  RiCloudLine,
  RiContrastDrop2Line,
  RiPagesLine,
  RiStackLine,
  RiSwapBoxLine,
} from "react-icons/ri";
import styled from "styled-components";

import ReportCard from "./Card";
import { Analyze } from "../../../../../../types";
import {
  computeGreenhouseGasesEmissionfromEcoIndex,
  computeWaterConsumptionfromEcoIndex,
  formatCO2e,
  formatLiters,
  nFormatter,
  nFormatterOctets,
} from "../../../../utils/__collection";

export type ReportProps = {
  analyze?: Analyze;
  ecoIndex?: number;
};

const Report: React.FC<ReportProps> = ({ analyze, ecoIndex }) => {
  return (
    <Container>
      <Description>
        {"Votre empreinte écologique pour cette visite :"}
      </Description>
      <Content>
        <ReportCard
          title={
            <>
              <RiContrastDrop2Line size={18} />
              <br />
              {ecoIndex
                ? formatLiters(computeWaterConsumptionfromEcoIndex(ecoIndex))
                : "-"}
            </>
          }
          description={<>{"consommation d'eau bleue"}</>}
        />
        <ReportCard
          title={
            <>
              <RiCloudLine size={18} />
              <br />
              {ecoIndex
                ? formatCO2e(
                    computeGreenhouseGasesEmissionfromEcoIndex(ecoIndex),
                  )
                : "-"}
            </>
          }
          description={<>{"émission de gaz à effet de serre"}</>}
        />
        <ReportCard
          title={
            <>
              <RiStackLine size={18} />
              <br />
              {analyze?.pageWeight !== undefined
                ? nFormatterOctets(analyze?.pageWeight / 8, 2)
                : "-"}
            </>
          }
          description={<>{"poids de la page visitée"}</>}
        />
        <ReportCard
          title={
            <>
              <RiPagesLine size={18} />
              <br />
              {analyze?.domSize !== undefined
                ? nFormatter(analyze?.domSize, 2)
                : "-"}
            </>
          }
          description={<>{"éléments dans le document"}</>}
        />
        <ReportCard
          title={
            <>
              <RiSwapBoxLine size={18} />
              <br />
              {analyze?.requestAmount !== undefined
                ? analyze?.requestAmount
                : "-"}
            </>
          }
          description={<>{"requêtes"}</>}
        />
      </Content>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Content = styled.div`
  display: flex;
  margin-left: -7px;
  margin-top: -7px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Description = styled.span`
  font-size: 13px;
  color: #909090;
`;

export default Report;
