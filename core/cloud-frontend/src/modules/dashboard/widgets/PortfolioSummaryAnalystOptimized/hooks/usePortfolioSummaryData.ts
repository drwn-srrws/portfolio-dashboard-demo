import { useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { omitBy } from "@/utils/omit";
import { compactDateRangeRequest } from "@/utils/dateRange";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { getAnalystPortfolioSummaryStats } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
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
    useQuery({
      queryKey: [
        `/api/dev/portfolio-metrics/analyst-portfolio-summary`,
        ...(metricFlags ? [{ ...metricFlags, invalidate_cache: true }] : []),
        payload,
      ],
      queryFn: ({ signal }) =>
        getAnalystPortfolioSummaryStats(
          payload,
          { ...metricFlags, invalidate_cache: true },
          undefined,
          signal
        ),
      enabled: false,
    });

  const {
    data: response,
    isLoading,
    refetch: refetchQuery,
  } = useQuery({
    queryKey: [
      `/api/dev/portfolio-metrics/analyst-portfolio-summary`,
      ...(metricFlags ? [metricFlags] : []),
      payload,
    ],
    queryFn: ({ signal }) =>
      getAnalystPortfolioSummaryStats(payload, metricFlags, undefined, signal),
    enabled,
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
