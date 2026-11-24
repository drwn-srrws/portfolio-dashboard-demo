import { useMemo, useCallback } from "react";
import { omitBy } from "@/utils/omit";
import { compactDateRangeRequest } from "@/utils/dateRange";
import { useGetBasketBreakdownStats } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import {
  BasketBreakdownRequest,
  BasketBreakdownResponse,
} from "@api/types/index";
import type { DateRangeRequest } from "@/api/aliases";
import type { MetricFlags } from "@/typings/MetricFlags";

interface UseBasketBreakdownDataParams {
  dateRange: DateRangeRequest;
  sharedFilters: Record<string, string[]>;
  metricFlags: MetricFlags;
  enabled: boolean;
}

export const useBasketBreakdownData = ({
  dateRange,
  sharedFilters,
  metricFlags,
  enabled,
}: UseBasketBreakdownDataParams) => {
  const baseFilters = useMemo(
    () => omitBy(sharedFilters, (item) => !item.length),
    [sharedFilters]
  );

  const payload: BasketBreakdownRequest = useMemo(
    () => ({
      date_range: {
        ...compactDateRangeRequest(dateRange),
      },
      filters: baseFilters,
    }),
    [dateRange, baseFilters]
  );

  const { isFetching: isLoadingInvalidate, refetch: invalidateCache } =
    useGetBasketBreakdownStats(
      payload,
      { ...metricFlags, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const {
    data: response,
    isLoading,
    refetch: refetchQuery,
  } = useGetBasketBreakdownStats(payload, metricFlags, {
    query: { enabled },
  });

  const responses: BasketBreakdownResponse[] = useMemo(
    () => response ?? [],
    [response]
  );

  const refetch = useCallback(async () => {
    await invalidateCache();
    await refetchQuery();
  }, [invalidateCache, refetchQuery]);

  return {
    responses,
    isLoading,
    isLoadingInvalidate,
    refetch,
  };
};
