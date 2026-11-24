import { useMemo } from "react";
import { useGetMonthlyPerformanceConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";

export interface MonthlyPerformanceConfig {
  supportedFilters: string[];
  groupByOptions: string[];
  defaultGroupBy: string;
}

const FALLBACK_CONFIG: MonthlyPerformanceConfig = {
  supportedFilters: [],
  groupByOptions: [],
  defaultGroupBy: "fund_name",
};

export const useMonthlyPerformanceConfig = () => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetMonthlyPerformanceConfigEndpoint();

  const config: MonthlyPerformanceConfig = useMemo(() => {
    const metadata = configData?.metadata;

    if (!metadata) {
      return FALLBACK_CONFIG;
    }

    const groupByOptions =
      metadata.group_by_config?.selectable_dimensions || [];
    const defaultGroupBy =
      metadata.group_config_default?.selectable_dimensions?.[0] || "fund_name";

    return {
      supportedFilters: metadata.supported_filters || [],
      groupByOptions,
      defaultGroupBy,
    };
  }, [configData]);

  return {
    config,
    isLoading,
    isError,
  };
};
