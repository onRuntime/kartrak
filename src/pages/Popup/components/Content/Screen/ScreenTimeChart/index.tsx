import React from "react";
import { AxisOptions, Chart } from "react-charts";
import styled from "styled-components";

import { TabTime } from "../../../../../../types";
import useTabTimes from "../../../../hooks/useTabTimes";
import { Range } from "../../../../types";
import { getDateRange, getRandomNumber } from "../../../../utils/__collection";

export type ScreenTimeChartProps = {
  range: Range;
};

const generateDatesInRange = (startDate: string, endDate: string) => {
  const dates = [];
  const currentDate = new Date(startDate);
  currentDate.setUTCHours(0);
  currentDate.setUTCMinutes(0);
  currentDate.setUTCSeconds(0);
  currentDate.setUTCMilliseconds(0);

  while (currentDate <= new Date(endDate)) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const ScreenTimeChart: React.FC<ScreenTimeChartProps> = ({
  range,
}: ScreenTimeChartProps) => {
  const tabtimes = useTabTimes();
  const dateRange = getDateRange(range);
  console.log("dateRange", dateRange);
  const datesInRange = generateDatesInRange(dateRange[0], dateRange[1]);

  const data = [
    {
      label: "Temps d'écran",
      data: datesInRange.map((date) => ({
        primary: date,
        secondary: getRandomNumber(0, 100),
      })),
    },
  ];

  console.log("data", data);

  const primaryAxis = React.useMemo<
    AxisOptions<(typeof data)[number]["data"][number]>
  >(
    () => ({
      getValue: (datum) => datum.primary as unknown as Date,
    }),
    []
  );

  const secondaryAxes = React.useMemo<
    AxisOptions<(typeof data)[number]["data"][number]>[]
  >(
    () => [
      {
        getValue: (datum) => datum.secondary,
        min: 0,
        elementType: "area",
        color: "#014335",
      },
    ],
    []
  );

  return (
    <Container>
      <StyledChart
        options={{
          data,
          primaryAxis,
          secondaryAxes,
          defaultColors: ["var(--green)"],
        }}
      />
    </Container>
  );
};

const Container = styled.div`
  height: 180px;
  width: 100%;
`;

const StyledChart = styled(Chart)`
  height: 100%;
  width: 100%;
`;

export default ScreenTimeChart;
