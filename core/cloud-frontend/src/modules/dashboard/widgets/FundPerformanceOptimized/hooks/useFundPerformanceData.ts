import { useMemo, useCallback } from "react";
import { omitBy } from "@/utils/omit";
import { useGetBenchmarkAndFundPerformanceStats } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import { BenchmarkAndFundPerformanceStats } from "@/api/types";
import type { DateRangeRequest } from "@/api/aliases";
import { compactDateRangeRequest } from "@/utils/dateRange";

interface UseFundPerformanceDataParams {
  dateRange: DateRangeRequest;
  sharedFilters: Record<string, string[]>;
  enabled: boolean;
}

export const useFundPerformanceData = ({
  dateRange,
  sharedFilters,
  enabled,
}: UseFundPerformanceDataParams) => {
  const payload = useMemo(
    () => ({
      date_range: {
        ...compactDateRangeRequest(dateRange),
      },
      filters: omitBy(sharedFilters, (item) => !item.length),
    }),
    [dateRange, sharedFilters]
  );

  const { isFetching: isLoadingInvalidate, refetch: invalidateCache } =
    useGetBenchmarkAndFundPerformanceStats(
      payload,
      { invalidate_cache: true },
      { query: { enabled: false } }
    );

  const {
    data: response,
    isLoading,
    refetch: refetchQuery,
  } = useGetBenchmarkAndFundPerformanceStats(payload, undefined, {
    query: { enabled },
  });

  const data = useMemo(
    () =>
      (response?.data ||
        []) as unknown as Array<BenchmarkAndFundPerformanceStats>,
    [response]
  );

  const displayColumns = useMemo(
    () => response?.metadata?.display_columns ?? [],
    [response]
  );

  const refetchData = useCallback(async () => {
    await invalidateCache();
    await refetchQuery();
  }, [invalidateCache, refetchQuery]);

  return {
    data,
    displayColumns,
    isLoading,
    isLoadingInvalidate,
    refetch: refetchData,
  };
};
