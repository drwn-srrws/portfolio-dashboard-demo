import { Time, UTCTimestamp } from "lightweight-charts";
import { getUnixTime } from "date-fns";
import { IntradayBar } from "../hooks/useIntradayBarsData";

export interface SparklineDataPoint {
  time: Time;
  value: number;
  type: "historical" | "realtime";
}

type ServerPriceData = Record<
  number,
  { instrument_id: number; price: number; timestamp: string }[]
>;

const convertTimestampToChartTime = (timestamp: string): Time => {
  const unixTimestamp = getUnixTime(new Date(timestamp));
  return unixTimestamp as UTCTimestamp;
};

export const buildIntradaySparklineData = (
  instrumentId: number,
  intradayBarsData: IntradayBar[]
): SparklineDataPoint[] => {
  if (!instrumentId) {
    return [];
  }
  if (!intradayBarsData) {
    return [];
  }
  const matchingBar = intradayBarsData.find(
    (bar) => bar.instrument_id === instrumentId
  );

  if (!matchingBar || !matchingBar.instrument_bars) {
    return [];
  }

  return matchingBar.instrument_bars.map((bar) => ({
    time: convertTimestampToChartTime(bar.timestamp),
    value: bar.price,
    type: "historical" as const,
  }));
};

export const buildRealtimeSparklineData = (
  instrumentId: number,
  realtimePriceData: ServerPriceData | undefined
): SparklineDataPoint[] => {
  if (!realtimePriceData || !realtimePriceData[instrumentId]) {
    return [];
  }

  return realtimePriceData[instrumentId].map((dataPoint) => ({
    time: convertTimestampToChartTime(dataPoint.timestamp),
    value: dataPoint.price,
    type: "realtime" as const,
  }));
};

export const combineSparklineData = (
  instrumentId: number,
  intradayBarsData: IntradayBar[],
  realtimePriceData: ServerPriceData | undefined
): SparklineDataPoint[] => {
  if (!instrumentId) {
    return [];
  }

  const historicalData = buildIntradaySparklineData(
    instrumentId,
    intradayBarsData
  );
  const realtimeData = buildRealtimeSparklineData(
    instrumentId,
    realtimePriceData
  );

  const allData = [...historicalData, ...realtimeData];

  const uniqueData = allData.reduce((acc, current) => {
    const exists = acc.find((item) => item.time === current.time);
    if (!exists) {
      acc.push(current);
    } else if (current.type === "realtime") {
      const index = acc.findIndex((item) => item.time === current.time);
      acc[index] = current;
    }
    return acc;
  }, [] as SparklineDataPoint[]);

  return uniqueData.sort((a, b) => Number(a.time) - Number(b.time));
};

export const formatSparklineDataForAgGrid = (
  data: SparklineDataPoint[]
): [Time, number][] => {
  return data.map((point) => [point.time, point.value]);
};
