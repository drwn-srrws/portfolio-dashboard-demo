import { MetricDisplayType, PerformanceOverviewStats } from "@api/types";
import {
  createMetricChartSeries,
  FUND_ORDER,
  FUND_COLOR_MAP,
} from "@/utils/charts";
import { IMetricChartSeries } from "@/components/MetricChart/components/MetricChart";

interface MetricChartDataPoint {
  time: string;
  value: number;
}

interface MetricChartData {
  value: string;
  name: string;
  data: MetricChartDataPoint[];
}

export const transformToChartData = (
  data: Array<PerformanceOverviewStats>,
  selectedGroupBy: string,
  displayMetric: string,
  activeMetricType: MetricDisplayType
): IMetricChartSeries[] => {
  if (!data || data.length === 0) return [];

  const shouldApplyFundOrdering = selectedGroupBy === "fund_name";
  const sortOptions = shouldApplyFundOrdering
    ? { sortOrder: FUND_ORDER, colorMap: FUND_COLOR_MAP }
    : undefined;

  // Group the flat data by the selected dimension
  const groupedData: Record<string, PerformanceOverviewStats[]> = {};
  data.forEach((item) => {
    const key = (item as unknown as Record<string, unknown>)[
      selectedGroupBy
    ] as string;
    if (!groupedData[key]) {
      groupedData[key] = [];
    }
    groupedData[key].push(item);
  });

  // Transform to chart format
  const metricChartData: MetricChartData[] = Object.entries(groupedData).map(
    ([key, items]) => ({
      value: key,
      name: key,
      data: items.map((item) => ({
        time: (item as unknown as Record<string, unknown>).date as string,
        value: (item as unknown as Record<string, unknown>)[
          displayMetric
        ] as number,
      })),
    })
  );

  const filteredChartData = metricChartData.map((series) => ({
    ...series,
    data: series.data.filter(
      (item) => item.value != null && !isNaN(item.value)
    ),
  }));

  return createMetricChartSeries(
    filteredChartData,
    activeMetricType,
    sortOptions
  );
};
