import { useMemo, useCallback } from "react";
import { omitBy } from "@/utils/omit";
import { compactDateRangeRequest } from "@/utils/dateRange";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useGetPortfolioSummaryStats } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import {
  PortfolioSummaryRequest,
  PortfolioSummaryRequestGroupByItem,
  PortfolioSummaryResponse,
} from "@api/types/index";
import type { DateRangeRequest } from "@/api/aliases";

interface UsePortfolioSummaryDataParams {
  dateRange: DateRangeRequest;
  groupBy: string;
  sharedFilters: Record<string, string[]>;
  enabled: boolean;
}

export const usePortfolioSummaryData = ({
  dateRange,
  groupBy,
  sharedFilters,
  enabled,
}: UsePortfolioSummaryDataParams) => {
  const { metricFlags } = useMetricFlags();

  const payload: PortfolioSummaryRequest = useMemo(
    () => ({
      date_range: {
        ...compactDateRangeRequest(dateRange),
      },
      filters: omitBy(sharedFilters, (item) => !item.length),
      group_by: [groupBy as PortfolioSummaryRequestGroupByItem],
    }),
    [dateRange, groupBy, sharedFilters]
  );

  const { isFetching: isLoadingInvalidate, refetch: invalidateCache } =
    useGetPortfolioSummaryStats(
      payload,
      { ...metricFlags, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const {
    data: response,
    isLoading,
    refetch: refetchQuery,
  } = useGetPortfolioSummaryStats(payload, metricFlags, {
    query: { enabled },
  });

  const responses: PortfolioSummaryResponse[] = useMemo(
    () => response ?? [],
    [response]
  );

  const refetch = useCallback(async () => {
    await invalidateCache();
    await refetchQuery();
  }, [invalidateCache, refetchQuery]);

  return { responses, isLoading, isLoadingInvalidate, refetch };
};
