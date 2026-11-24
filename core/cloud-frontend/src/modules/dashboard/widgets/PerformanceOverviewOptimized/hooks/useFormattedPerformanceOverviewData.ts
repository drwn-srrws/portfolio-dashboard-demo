import { useMemo } from "react";
import {
  MetricCatalogItem,
  MetricDisplayType,
  PerformanceOverviewStats,
  DataResponseMetadata,
} from "@api/types/index";
import { IMetricChartSeries } from "@/components/MetricChart/components/MetricChart";

interface UseFormattedPerformanceOverviewDataParams {
  data: Array<PerformanceOverviewStats>;
  metadata?: DataResponseMetadata;
  metricsCatalog: MetricCatalogItem[];
  selectedGroupBy: string;
  selectedDisplayValue?: string;
  transformToChartData: (
    data: Array<PerformanceOverviewStats>,
    selectedGroupBy: string,
    displayMetric: string,
    activeMetricType: MetricDisplayType
  ) => IMetricChartSeries[];
}

export const useFormattedPerformanceOverviewData = ({
  data,
  metadata,
  metricsCatalog,
  selectedGroupBy,
  selectedDisplayValue,
  transformToChartData,
}: UseFormattedPerformanceOverviewDataParams) => {
  const displayMetric = useMemo(() => {
    if (selectedDisplayValue) return selectedDisplayValue;
    return (
      metadata?.display_columns?.find(
        (col: string) => col !== "date" && col !== selectedGroupBy
      ) || "cumulative_pnl_percent_nav"
    );
  }, [metadata, selectedGroupBy, selectedDisplayValue]);

  const activeMetricType = useMemo(() => {
    const metric = metricsCatalog.find((item) => item.name === displayMetric);
    return metric?.display_type || MetricDisplayType.percent;
  }, [metricsCatalog, displayMetric]);

  const chartData = useMemo(() => {
    if (!data.length) return [];

    return transformToChartData(
      data,
      selectedGroupBy,
      displayMetric,
      activeMetricType
    );
  }, [
    data,
    selectedGroupBy,
    displayMetric,
    activeMetricType,
    transformToChartData,
  ]);

  return {
    chartData,
    displayMetric,
    activeMetricType,
  };
};
