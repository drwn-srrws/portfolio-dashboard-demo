import { useMemo, useCallback } from "react";
import { omitBy } from "@/utils/omit";
import { useGetAnalystBreakdownStats } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import { AnalystBreakdownRequest } from "@/api/types/analystBreakdownRequest";
import { GetAnalystBreakdownStatsParams } from "@/api/types/getAnalystBreakdownStatsParams";
import type { DateRangeRequest } from "@/api/aliases";
import { compactDateRangeRequest } from "@/utils/dateRange";

interface UseAnalystBreakdownDataParams {
  dateRange: DateRangeRequest;
  sharedFilters: Record<string, string[]>;
  enabled: boolean;
  params?: GetAnalystBreakdownStatsParams;
}

export const useAnalystBreakdownData = ({
  dateRange,
  sharedFilters,
  enabled,
  params,
}: UseAnalystBreakdownDataParams) => {
  const payload: AnalystBreakdownRequest = useMemo(
    () => ({
      date_range: {
        ...compactDateRangeRequest(dateRange),
      },
      filters: omitBy(sharedFilters, (item) => !item.length),
    }),
    [dateRange, sharedFilters]
  );

  const {
    data: response,
    isLoading,
    refetch,
  } = useGetAnalystBreakdownStats(payload, params, {
    query: { enabled },
  });

  const { isFetching: isLoadingInvalidate, refetch: invalidateCache } =
    useGetAnalystBreakdownStats(
      payload,
      { ...params, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const displayColumns = useMemo(
    () => response?.metadata?.display_columns ?? [],
    [response]
  );

  const refetchData = useCallback(async () => {
    await invalidateCache();
    await refetch();
  }, [invalidateCache, refetch]);

  return {
    response,
    displayColumns,
    isLoading: isLoading || isLoadingInvalidate,
    refetch: refetchData,
  };
};
