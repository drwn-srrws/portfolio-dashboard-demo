import { useMemo } from "react";
import { useGetHeatMapsConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import type { DateRangeRequest } from "@/api/aliases";

export interface HeatMapConfig {
  groupByMetrics: string[];
  requiredDimensions: string[];
  colorMetric: string;
  sizeMetric: string;
  defaultGroupBy: string | null;
  supportedFilters: string[];
  dateRangePeriod: DateRangeRequest["period"] | null;
}

const FALLBACK_HEAT_MAP_CONFIG: HeatMapConfig = {
  groupByMetrics: [],
  requiredDimensions: [],
  colorMetric: "",
  sizeMetric: "",
  defaultGroupBy: null,
  supportedFilters: [],
  dateRangePeriod: null,
};

export const useHeatMapConfig = () => {
  const {
    data: heatMapsConfigData,
    isLoading,
    isError,
  } = useGetHeatMapsConfigEndpoint();

  const config: HeatMapConfig = useMemo(() => {
    const metadata = heatMapsConfigData?.metadata;

    if (!metadata) {
      return FALLBACK_HEAT_MAP_CONFIG;
    }

    const groupByConfig = metadata.group_by_config;
    const defaultConfig = metadata.group_config_default;

    const defaultGroupByList = defaultConfig?.selectable_dimensions || [];
    const defaultGroupBy =
      defaultGroupByList.length > 0 ? defaultGroupByList[0] : null;

    return {
      groupByMetrics: groupByConfig?.selectable_dimensions || [],
      requiredDimensions: groupByConfig?.required_dimensions || [],
      colorMetric: metadata.color_metric || "",
      sizeMetric: metadata.size_metric || "",
      defaultGroupBy,
      supportedFilters: metadata.supported_filters || [],
      dateRangePeriod: metadata.date_range?.period ?? null,
    };
  }, [heatMapsConfigData]);

  return {
    config,
    isLoading,
    isError,
  };
};
