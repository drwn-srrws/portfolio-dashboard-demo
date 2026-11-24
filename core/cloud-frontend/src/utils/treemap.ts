import { groupBy, mapObjIndexed, toLower } from "ramda";

import { MetricCatalogItem, MetricDisplayType } from "@api/types/index";
import { EchartsTreemapData } from "@components/Treemap/Treemap";
import { calculateVisualValue, findMinMax } from "@components/Treemap/utils";

import { formatMetric } from "./metrics";

export interface MetricData {
  value: number;
  display_type: string;
  display_name: string;
}

export interface TreemapData {
  name: string;
  colorMetric: MetricData;
  sizeMetric: MetricData;
  tooltipMetrics: MetricData[];
}

export interface FlatListData {
  [key: string]: unknown;
}

const formatFlatListToTreemapData = ({
  data,
  groupByMetric,
  colorMetric,
  sizeMetric,
  leafMetric,
  metrics,
}: {
  data: FlatListData[];
  groupByMetric: string;
  colorMetric: string;
  sizeMetric: string;
  leafMetric: string;
  metrics: MetricCatalogItem[];
}) => {
  const filteredItems = data.filter((item) => item[groupByMetric]);

  const groupedData = groupBy(
    (item) => toLower(String(item[groupByMetric])),
    filteredItems
  );

  const {
    display_type: colorMetricDisplayType,
    display_name: colorMetricDisplayName,
  } = metrics.find((m) => m.name === colorMetric) ?? {};
  const {
    display_type: sizeMetricDisplayType,
    display_name: sizeMetricDisplayName,
  } = metrics.find((m) => m.name === sizeMetric) ?? {};

  const getTooltipMetrics = (item: FlatListData) => {
    const metrics = [
      {
        value: Number(item[colorMetric]),
        display_type: colorMetricDisplayType ?? "default",
        display_name: colorMetricDisplayName ?? colorMetric,
      },
    ];

    if (colorMetric !== sizeMetric) {
      metrics.push({
        value: Number(item[sizeMetric]),
        display_type: sizeMetricDisplayType ?? "default",
        display_name: sizeMetricDisplayName ?? sizeMetric,
      });
    }

    return metrics;
  };

  const formattedData = mapObjIndexed((items, key: string) => {
    const index = Object.keys(groupedData).indexOf(key);
    return {
      id: index,
      name: key,
      data: (items || []).map((item) => ({
        name: String(item[leafMetric]),
        colorMetric: {
          value: Number(item[colorMetric]),
          display_type: colorMetricDisplayType ?? "default",
          display_name: colorMetricDisplayName ?? colorMetric,
        },
        tooltipMetrics: getTooltipMetrics(item),
        sizeMetric: {
          value: Number(item[sizeMetric]),
          display_type: sizeMetricDisplayType ?? "default",
          display_name: sizeMetricDisplayName ?? sizeMetric,
        },
      })),
    };
  }, groupedData);

  return Object.values(formattedData);
};

const processTreemapData = (data: TreemapData[]): EchartsTreemapData[] => {
  const { min, max } = findMinMax(data);

  return data.map((item) => {
    const sizeValue = Math.abs(item.sizeMetric.value);
    const visualValue = calculateVisualValue(item.colorMetric.value, min, max);
    return {
      name: item.name,
      value: [sizeValue, visualValue],
      colorMetric: item.colorMetric,
      tooltipMetrics: item.tooltipMetrics,
      label: {
        formatter: `${item.name}\n${formatMetric(item.colorMetric.value, item.colorMetric.display_type as MetricDisplayType)}`,
      },
    };
  });
};

export const formatAndProcessTreemapData = ({
  data,
  groupByMetric,
  colorMetric,
  sizeMetric,
  leafMetric,
  metrics,
}: {
  data: FlatListData[];
  groupByMetric: string;
  colorMetric: string;
  sizeMetric: string;
  leafMetric: string;
  metrics: MetricCatalogItem[];
}) => {
  const groupedData = formatFlatListToTreemapData({
    data,
    groupByMetric,
    colorMetric,
    sizeMetric,
    leafMetric,
    metrics,
  });

  return groupedData.map((group) => ({
    id: group.id,
    name: group.name,
    data: processTreemapData(group.data),
  }));
};
