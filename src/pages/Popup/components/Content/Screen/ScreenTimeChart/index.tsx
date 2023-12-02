import React from "react";
import { AxisOptions, Chart, UserSerie } from "react-charts";
import styled from "styled-components";

import { TabTime } from "../../../../../../types";
import useTabTimes from "../../../../hooks/useTabTimes";
import { DateRange, Range } from "../../../../types";
import { getDateRange } from "../../../../utils/__collection";

export type ScreenTimeChartProps = {
  range: Range;
};

const groupTabTimes = (
  tabtimes: TabTime[],
  dateRange: DateRange,
  range: Range
) => {
  if (range === Range.Day) {
    // Group by hour for Range.Day
    return groupTabTimesByHour(tabtimes, dateRange);
  } else {
    // Group by day for other ranges
    return groupTabTimesByDay(tabtimes, dateRange);
  }
};

const groupTabTimesByDay = (tabtimes: TabTime[], dateRange: DateRange) => {
  const [startDate, endDate] = dateRange;
  const start = new Date(startDate);
  const end = new Date(endDate);

  const allDatesInRange = [];
  const currentDate = new Date(start);

  // Generate an array of all dates within the range
  while (currentDate <= end) {
    allDatesInRange.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const tabtimesByDay: { [key: string]: TabTime[] } = {};

  // Initialize the tabtimesByDay object with empty arrays for each date
  allDatesInRange.forEach((day) => {
    tabtimesByDay[day] = [];
  });

  // Fill in the arrays with the corresponding TabTime entries
  tabtimes.forEach((tabtime) => {
    const tabDate = new Date(tabtime.startAt);
    const day = tabDate.toISOString().split("T")[0];

    if (tabtimesByDay[day]) {
      tabtimesByDay[day].push(tabtime);
    }
  });

  return tabtimesByDay;
};

const groupTabTimesByHour = (tabtimes: TabTime[], dateRange: DateRange) => {
  const [startDate, endDate] = dateRange;
  const start = new Date(startDate);
  const end = new Date(endDate);

  const allHoursInRange = [];
  const currentHour = new Date(start);

  // Generate an array of all hours within the range
  while (currentHour <= end) {
    allHoursInRange.push(
      currentHour.toLocaleString("en-US", { hour: "numeric", hour12: false })
    ); // Get hour in 24-hour format
    currentHour.setHours(currentHour.getHours() + 1);
  }

  const tabtimesByHour: { [key: string]: TabTime[] } = {};

  console.log("allHoursInRange", allHoursInRange);

  // Initialize the tabtimesByHour object with empty arrays for each hour
  allHoursInRange.forEach((hour) => {
    tabtimesByHour[hour] = [];
  });

  // Fill in the arrays with the corresponding TabTime entries
  tabtimes.forEach((tabtime) => {
    const tabHour = new Date(tabtime.startAt).toLocaleString("en-US", {
      hour: "numeric",
      hour12: false,
    }); // Get hour in 24-hour format

    if (tabtimesByHour[tabHour]) {
      tabtimesByHour[tabHour].push(tabtime);
    }
  });

  console.log("tabtimesByHour", tabtimesByHour);

  return tabtimesByHour;
};

const calculateTimeSpent = (tabtimes: TabTime[], range: Range) => {
  return tabtimes.reduce((totalTime, tab) => {
    const startTime = new Date(tab.startAt);
    const endTime = tab.endAt ? new Date(tab.endAt) : new Date();

    if (range === Range.Day) {
      // Check if the tab spans across multiple hours
      if (startTime.getHours() !== endTime.getHours()) {
        const nextHour = new Date(startTime);
        nextHour.setHours(startTime.getHours() + 1, 0, 0, 0);

        const timeOnFirstHour = nextHour.getTime() - startTime.getTime();
        const timeOnSecondHour = endTime.getTime() - nextHour.getTime();

        return totalTime + timeOnFirstHour + timeOnSecondHour;
      }
    } else {
      // Check if the tab spans across multiple days
      if (startTime.toDateString() !== endTime.toDateString()) {
        const midnightNextDay = new Date(startTime);
        midnightNextDay.setHours(24, 0, 0, 0);

        const timeOnFirstDay = midnightNextDay.getTime() - startTime.getTime();
        const timeOnSecondDay = endTime.getTime() - midnightNextDay.getTime();

        return totalTime + timeOnFirstDay + timeOnSecondDay;
      }
    }

    // For a single time span (either hour or day)
    const duration = endTime.getTime() - startTime.getTime();
    return totalTime + duration;
  }, 0);
};

const convertTime = (
  timeSpentInMilliseconds: number,
  unit: "h" | "m"
): number => {
  if (unit === "h") {
    return timeSpentInMilliseconds / (3600 * 1000); // Convert milliseconds to hours
  } else if (unit === "m") {
    return timeSpentInMilliseconds / (60 * 1000); // Convert milliseconds to minutes
  } else {
    throw new Error(`Invalid unit: ${unit}`);
  }
};

const prepareChartData = (
  tabtimesByTime: { [key: string]: TabTime[] },
  unit: "h" | "m" = "h",
  range: Range
) => {
  const chartData = [];

  for (const time in tabtimesByTime) {
    if (Object.prototype.hasOwnProperty.call(tabtimesByTime, time)) {
      const timeSpentInMilliseconds = calculateTimeSpent(
        tabtimesByTime[time],
        range
      );

      const timeSpent = convertTime(timeSpentInMilliseconds, unit);
      const date = range === Range.Day ? parseInt(time, 10) : new Date(time);
      chartData.push({ primary: date, secondary: timeSpent });
    }
  }

  return chartData;
};

const ScreenTimeChart: React.FC<ScreenTimeChartProps> = ({
  range,
}: ScreenTimeChartProps) => {
  const tabtimes = useTabTimes();
  const dateRange = getDateRange(range);

  const tabtimesGrouped = groupTabTimes(tabtimes, dateRange, range);
  const chartData = prepareChartData(
    tabtimesGrouped,
    range === Range.Day ? "m" : "h",
    range
  );

  console.log("chartData", chartData);

  const data: UserSerie<{
    primary: Date | string;
    secondary: number;
  }>[] = [
    {
      label: "Temps d'écran",
      data: chartData,
    },
  ];

  const primaryAxis = React.useMemo<
    AxisOptions<(typeof data)[number]["data"][number]>
  >(() => {
    if (range === Range.Day) {
      // For Range.Day, represent primary axis as hours (0-23)
      return {
        getValue: (datum) => datum.primary as unknown as number,
        min: 0,
        max: 23,
      };
    } else {
      // For other ranges, represent primary axis as Date
      return {
        getValue: (datum) => datum.primary as unknown as Date,
        min: dateRange[0],
        max: dateRange[1],
      };
    }
  }, [range, dateRange]);

  const secondaryAxes = React.useMemo<
    AxisOptions<(typeof data)[number]["data"][number]>[]
  >(
    () => [
      {
        getValue: (datum) => datum.secondary as unknown as number,
        min: 0,
        elementType: "area",
        color: "#014335",
        formatters: {
          scale: (value: number) => {
            if (range === Range.Day) {
              return `${Math.round(value)}m`;
            } else {
              return `${Math.round(value)}h`;
            }
          },
        },
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
