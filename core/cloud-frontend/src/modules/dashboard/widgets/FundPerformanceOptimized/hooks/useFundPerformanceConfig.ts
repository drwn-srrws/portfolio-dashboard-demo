import { useMemo } from "react";
import { useGetBenchmarkAndFundPerformanceStats } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import type { DateRangeRequest } from "@/api/aliases";
import { compactDateRangeRequest } from "@/utils/dateRange";

export interface FundPerformanceConfig {
  supportedFilters: string[];
}

interface UseFundPerformanceConfigParams {
  dateRange: DateRangeRequest;
}

export const useFundPerformanceConfig = ({
  dateRange,
}: UseFundPerformanceConfigParams) => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetBenchmarkAndFundPerformanceStats({
    date_range: {
      ...compactDateRangeRequest(dateRange),
    },
  });

  const config: FundPerformanceConfig = useMemo(() => {
    const metadata = configData?.metadata;

    if (!metadata) {
      return {
        supportedFilters: [],
      };
    }

    return {
      supportedFilters:
        (metadata as unknown as { supported_filters?: string[] })
          .supported_filters || [],
    };
  }, [configData]);

  return {
    config,
    metadata: configData?.metadata,
    isLoading,
    isError,
  };
};
