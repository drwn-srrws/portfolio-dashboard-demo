import { useMemo } from "react";
import { useGetLtdYearlyPerformanceConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import { DateRangeRequest } from "@/api/aliases";

export interface YearlyPerformanceConfig {
  supportedFilters: string[];
  dateRange?: DateRangeRequest;
}

const FALLBACK_CONFIG: YearlyPerformanceConfig = {
  supportedFilters: [],
};

export const useYearlyPerformanceConfig = () => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetLtdYearlyPerformanceConfigEndpoint();

  const config: YearlyPerformanceConfig = useMemo(() => {
    const metadata = configData?.metadata;

    if (!metadata) {
      return FALLBACK_CONFIG;
    }

    return {
      supportedFilters: metadata.supported_filters || [],
      dateRange: metadata.date_range,
    };
  }, [configData]);

  return {
    config,
    isLoading,
    isError,
  };
};
