import { useMemo, useCallback } from "react";
import { omitBy } from "@/utils/omit";
import { compactDateRangeRequest } from "@/utils/dateRange";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useGetLtdYearlyPerformanceStats } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import { LtdYearlyPerformanceRequest } from "@api/types/index";
import type { DateRangeRequest } from "@/api/aliases";

interface UseYearlyPerformanceDataParams {
  dateRange: DateRangeRequest;
  sharedFilters: Record<string, string[]>;
  enabled: boolean;
}

export const useYearlyPerformanceData = ({
  dateRange,
  sharedFilters,
  enabled,
}: UseYearlyPerformanceDataParams) => {
  const { metricFlags } = useMetricFlags();

  const payload: LtdYearlyPerformanceRequest = useMemo(
    () => ({
      date_range: {
        ...compactDateRangeRequest(dateRange),
      },
      filters: omitBy(sharedFilters, (item) => !item.length),
    }),
    [dateRange, sharedFilters]
  );

  const { isFetching: isLoadingInvalidate, refetch: invalidateCache } =
    useGetLtdYearlyPerformanceStats(
      payload,
      { ...metricFlags, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const {
    data: response,
    isLoading,
    refetch,
  } = useGetLtdYearlyPerformanceStats(payload, metricFlags, {
    query: { enabled },
  });

  const refetchData = useCallback(async () => {
    await invalidateCache();
    await refetch();
  }, [invalidateCache, refetch]);

  return {
    response: response ?? null,
    isLoading,
    isLoadingInvalidate,
    refetch: refetchData,
  };
};
