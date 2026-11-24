import { useMemo, useCallback } from "react";
import { omitBy } from "@/utils/omit";
import { compactDateRangeRequest } from "@/utils/dateRange";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useGetFundSummaryStats } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import { FundSummaryRequest, FundSummaryStats } from "@api/types/index";
import type { DateRangeRequest } from "@/api/aliases";

interface UseFundSummaryDataParams {
  dateRange: DateRangeRequest;
  sharedFilters: Record<string, string[]>;
  enabled: boolean;
}

export const useFundSummaryData = ({
  dateRange,
  sharedFilters,
  enabled,
}: UseFundSummaryDataParams) => {
  const { metricFlags } = useMetricFlags();

  const payload: FundSummaryRequest = useMemo(
    () => ({
      date_range: {
        ...compactDateRangeRequest(dateRange),
      },
      filters: omitBy(sharedFilters, (item) => !item.length),
    }),
    [dateRange, sharedFilters]
  );

  const { isFetching: isLoadingInvalidate, refetch: invalidateCache } =
    useGetFundSummaryStats(
      payload,
      { ...metricFlags, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const {
    data: response,
    isLoading,
    refetch: refetchQuery,
  } = useGetFundSummaryStats(payload, metricFlags, {
    query: { enabled },
  });

  const rows: FundSummaryStats[] = useMemo(
    () => response?.data ?? [],
    [response]
  );

  const refetchData = useCallback(async () => {
    await invalidateCache();
    await refetchQuery();
  }, [invalidateCache, refetchQuery]);

  return {
    rows,
    isLoading,
    isLoadingInvalidate,
    refetch: refetchData,
  };
};
