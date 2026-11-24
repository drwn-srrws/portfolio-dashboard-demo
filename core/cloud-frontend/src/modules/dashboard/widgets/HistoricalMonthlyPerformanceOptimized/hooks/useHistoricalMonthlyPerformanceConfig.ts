import { useMemo } from "react";
import { useGetHistoricalPerfMonthlyPerfConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";

export interface HistoricalMonthlyPerformanceConfig {
  supportedFilters: string[];
  groupByOptions: string[];
  defaultGroupBy: string;
}

const FALLBACK_CONFIG: HistoricalMonthlyPerformanceConfig = {
  supportedFilters: [],
  groupByOptions: [],
  defaultGroupBy: "fund_name",
};

export const useHistoricalMonthlyPerformanceConfig = () => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetHistoricalPerfMonthlyPerfConfigEndpoint();

  const config: HistoricalMonthlyPerformanceConfig = useMemo(() => {
    if (!configData) return FALLBACK_CONFIG;
    return {
      supportedFilters: configData.metadata?.supported_filters || [],
      groupByOptions:
        configData.metadata?.group_by_config?.selectable_dimensions || [],
      defaultGroupBy:
        configData.metadata?.group_config_default?.selectable_dimensions?.[0] ||
        "fund_name",
    };
  }, [configData]);

  return { config, isLoading, isError };
};
