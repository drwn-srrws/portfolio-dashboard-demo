import { useMemo } from "react";
import { useGetPerformanceOverviewConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";

export interface PerformanceOverviewConfig {
  selectableDimensions: string[];
  defaultGroupBy: string;
  supportedFilters: string[];
  defaultBenchmarkId: string;
  benchmarks: Record<string, string>;
}

export const usePerformanceOverviewConfig = () => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetPerformanceOverviewConfigEndpoint();

  const config: PerformanceOverviewConfig = useMemo(() => {
    const metadata = configData?.metadata;

    if (!metadata) {
      return {
        selectableDimensions: [],
        defaultGroupBy: "direction",
        supportedFilters: [],
        defaultBenchmarkId: "",
        benchmarks: {},
      };
    }

    const selectableDimensions =
      metadata.group_by_config?.selectable_dimensions || [];
    const defaultGroupBy = selectableDimensions[0] || "direction";

    return {
      selectableDimensions,
      defaultGroupBy,
      supportedFilters: metadata.supported_filters || [],
      defaultBenchmarkId: configData?.benchmark_id || "",
      benchmarks: configData?.benchmarks ?? {},
    };
  }, [configData]);

  return {
    config,
    isLoading,
    isError,
  };
};
