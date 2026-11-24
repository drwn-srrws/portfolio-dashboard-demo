import { useMemo, useCallback } from "react";
import { omitBy } from "@/utils/omit";
import { compactDateRangeRequest } from "@/utils/dateRange";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useGetFundBreakdownStatsEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import { FundBreakdownRequest, FundBreakdownResponse } from "@api/types/index";
import type { DateRangeRequest } from "@/api/aliases";

interface UseFundBreakdownDataParams {
  dateRange: DateRangeRequest;
  sharedFilters: Record<string, string[]>;
  enabled: boolean;
}

export const useFundBreakdownData = ({
  dateRange,
  sharedFilters,
  enabled,
}: UseFundBreakdownDataParams) => {
  const { metricFlags } = useMetricFlags();

  const payload: FundBreakdownRequest = useMemo(
    () => ({
      date_range: {
        ...compactDateRangeRequest(dateRange),
      },
      filters: omitBy(sharedFilters, (item) => !item.length),
    }),
    [dateRange, sharedFilters]
  );

  const { isFetching: isLoadingInvalidate, refetch: invalidateCache } =
    useGetFundBreakdownStatsEndpoint(
      payload,
      { ...metricFlags, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const {
    data: response,
    isLoading,
    refetch: refetchQuery,
  } = useGetFundBreakdownStatsEndpoint(payload, metricFlags, {
    query: { enabled },
  });

  const responses: FundBreakdownResponse[] = useMemo(
    () => response ?? [],
    [response]
  );

  const refetchData = useCallback(async () => {
    await invalidateCache();
    await refetchQuery();
  }, [invalidateCache, refetchQuery]);

  return {
    responses,
    isLoading,
    isLoadingInvalidate,
    refetch: refetchData,
  };
};
