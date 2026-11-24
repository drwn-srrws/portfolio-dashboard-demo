import { useMemo } from "react";
import { useGetLtdAlphaYearlyAlphaPerfConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import { DateRangeRequest } from "@/api/aliases";

export interface YearlyAlphaPnLConfig {
  supportedFilters: string[];
  benchmarkIds: string[];
  dateRange?: DateRangeRequest;
}

const FALLBACK_CONFIG: YearlyAlphaPnLConfig = {
  supportedFilters: [],
  benchmarkIds: [],
};

export const useYearlyAlphaPnLConfig = () => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetLtdAlphaYearlyAlphaPerfConfigEndpoint();

  const config: YearlyAlphaPnLConfig = useMemo(() => {
    if (!configData) {
      return FALLBACK_CONFIG;
    }

    return {
      supportedFilters: configData.metadata?.supported_filters || [],
      benchmarkIds: configData.benchmark_ids || [],
      dateRange: configData.metadata?.date_range,
    };
  }, [configData]);

  return {
    config,
    isLoading,
    isError,
  };
};
