import { LineData, Time } from "lightweight-charts";
import { groupBy, mapObjIndexed } from "ramda";
import { MetricResult, MetricDisplayType } from "@api/types";
import { IMetricChartSeries } from "@/components/MetricChart/components/MetricChart";
import { IMetricDisplayType } from "./metrics";

export interface MultiChartData {
  [key: string]: unknown;
  date: string;
}

const line_colors_1 = [
  "#AB47BD",
  "#E65A1E",
  "#27B9D5",
  "#F94144",
  "#F8961E",
  "#F9844A",
  "#F9C74F",
  "#43AA8B",
  "#577590",
  "#277DA1",
  "#4D908E",
  "#577590",
  "#A44A3F",
  "#FF4D4D",
  "#FFD166",
  "#06D6A0",
  "#118AB2",
  "#073B4C",
  "#EF476F",
  "#F78C6B",
  "#2A9D8F",
  "#E63946",
  "#BC5090",
  "#8338EC",
  "#3A86FF",
];

const line_colors_2 = [
  "#8B9467",
  "#6495ED",
  "#FF99CC",
  "#66CCCC",
  "#CC9966",
  "#99CC66",
  "#66CC99",
  "#CC66CC",
  "#6699CC",
  "#CC6699",
  "#9966CC",
  "#66CC66",
  "#CC9966",
  "#6699CC",
  "#99CC99",
  "#66CCCC",
  "#CC66CC",
  "#9966CC",
  "#66CC99",
  "#CC6699",
  "#99CC66",
  "#66CC66",
  "#CC9966",
  "#6699CC",
];

export const lineColors = (index: number) => {
  if (index === 0) return line_colors_1;
  return line_colors_2;
};

export const FUND_ORDER = ["Flagship", "Innovation", "Bio"];

export const FUND_COLOR_MAP: Record<string, string> = {
  Flagship: line_colors_1[0],
  Innovation: line_colors_1[1],
  Bio: line_colors_1[2],
};

export const sortByPredefinedOrder = <T extends { name: string }>(
  items: T[],
  predefinedOrder: string[],
  colorMap: Record<string, string>
): (T & { sortIndex: number; deterministicColor?: string })[] => {
  return items
    .map((item) => {
      const sortIndex = predefinedOrder.indexOf(item.name);
      return {
        ...item,
        sortIndex: sortIndex === -1 ? predefinedOrder.length : sortIndex,
        deterministicColor: colorMap[item.name],
      };
    })
    .sort((a, b) => {
      if (a.sortIndex !== b.sortIndex) {
        return a.sortIndex - b.sortIndex;
      }
      return a.name.localeCompare(b.name);
    });
};

export const formatFlatListToMultiChartData = ({
  data,
  metric,
  groupByField,
  color,
}: {
  data: MultiChartData[];
  metric: string;
  groupByField: string;
  color?: string[];
}) => {
  const groupedData = groupBy((item) => String(item[groupByField]), data);

  return Object.values(
    mapObjIndexed((items, key) => {
      const id = crypto.randomUUID();
      const index = Object.keys(groupedData).indexOf(key);
      return {
        id,
        name: key,
        color:
          color?.[index % color.length] ??
          line_colors_1[index % line_colors_1.length],
        data: (items || []).map((item) => ({
          time: item.date,
          value: item[metric],
        })),
      };
    }, groupedData)
  );
};

export interface IMetricChartDataItem {
  value: string;
  name: string;
  data: LineData<Time>[];
}

export const mapMetricResultToChartData = (
  groupByKey: string,
  metricKey: string,
  metrics: MetricResult[]
): IMetricChartDataItem[] => {
  return metrics.flatMap((metric) => {
    const firstItem = metric.data?.[0];

    if (!firstItem) return [];

    return {
      value: firstItem[groupByKey] as string,
      name: firstItem[groupByKey] as string,
      data:
        metric.data?.map((item) => ({
          time: item.date as string,
          value: item[metricKey] as number,
        })) ?? [],
    };
  });
};

export const getMetricDisplayType = (
  metricKeys: string[],
  metricsCatalog: Array<{ name: string; display_type?: MetricDisplayType }>,
  fallback: MetricDisplayType = MetricDisplayType.percent
): MetricDisplayType => {
  const firstMetric = metricsCatalog.find((m) => m.name === metricKeys[0]);
  return firstMetric?.display_type ?? fallback;
};

export const mapSingleFundMultipleMetricsToChartData = (
  metricKeys: string[],
  metricResult: MetricResult,
  metricsCatalog: Array<{ name: string; display_name?: string }>
): IMetricChartDataItem[] => {
  return metricKeys.map((metricName) => {
    const metric = metricsCatalog.find((m) => m.name === metricName);
    const label = metric?.display_name ?? metricName;

    const data =
      metricResult?.data
        ?.map((item) => ({
          time: item.date as string,
          value: item[metricName] as number,
        }))
        .filter((item) => item.value != null && !isNaN(item.value)) ?? [];

    return {
      value: label,
      name: label,
      data,
    };
  });
};

export const mapV2MetricResultToChartData = (
  groupByKey: string,
  metricKey: string,
  metrics: Record<string, unknown>[]
): IMetricChartDataItem[] => {
  const groupMap = groupBy((metric) => `${metric[groupByKey]}`, metrics);

  return Object.entries(groupMap).flatMap(([groupByValue, metrics]) => ({
    value: groupByValue,
    name: groupByValue,
    data:
      metrics?.map((metric) => ({
        time: metric.date as string,
        value: metric[metricKey] as number,
      })) ?? [],
  }));
};

export const createMetricChartSeries = (
  metricChartDataItems: IMetricChartDataItem[],
  metricDisplayType: IMetricDisplayType,
  options?: {
    sortOrder?: string[];
    colorMap?: Record<string, string>;
  }
): IMetricChartSeries[] => {
  let sortedItems = metricChartDataItems;

  if (options?.sortOrder && options?.colorMap) {
    const itemsWithSortInfo = sortByPredefinedOrder(
      metricChartDataItems,
      options.sortOrder,
      options.colorMap
    );
    sortedItems = itemsWithSortInfo;
  }

  return sortedItems.flatMap((chartDataItem, index) => {
    const deterministicColor =
      "deterministicColor" in chartDataItem
        ? chartDataItem.deterministicColor
        : undefined;
    const color =
      deterministicColor || lineColors(0)[index % lineColors(0).length];

    return {
      id: chartDataItem.value,
      name: chartDataItem.name,
      metricDisplayType,
      color,
      data: chartDataItem.data,
    };
  }) as IMetricChartSeries[];
};
