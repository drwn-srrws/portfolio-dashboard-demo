import { useMemo, useCallback } from "react";
import { omitBy } from "@/utils/omit";
import { compactDateRangeRequest } from "@/utils/dateRange";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useGetLtdAlphaYearlyAlphaPerfStats } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import { LTDAlphaYearlyAlphaPerfRequest } from "@api/types/index";
import { Filters } from "@/typings/Filters";
import type { DateRangeRequest } from "@/api/aliases";

interface UseYearlyAlphaPnLDataParams {
  dateRange: DateRangeRequest;
  sharedFilters: Filters;
  benchmarkIds: string[];
  metric?: string;
  enabled: boolean;
}

export const useYearlyAlphaPnLData = ({
  dateRange,
  sharedFilters,
  benchmarkIds,
  metric,
  enabled,
}: UseYearlyAlphaPnLDataParams) => {
  const { metricFlags } = useMetricFlags();

  const payload: LTDAlphaYearlyAlphaPerfRequest = useMemo(
    () => ({
      date_range: {
        ...compactDateRangeRequest(dateRange),
      },
      filters: omitBy(sharedFilters, (item) => !item.length),
      benchmark_ids: benchmarkIds,
      metric: metric ?? null,
    }),
    [dateRange, sharedFilters, benchmarkIds, metric]
  );

  const { isFetching: isLoadingInvalidate, refetch: invalidateCache } =
    useGetLtdAlphaYearlyAlphaPerfStats(
      payload,
      { ...metricFlags, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const {
    data: response,
    isLoading,
    refetch,
  } = useGetLtdAlphaYearlyAlphaPerfStats(payload, metricFlags, {
    query: { enabled: enabled && benchmarkIds.length > 0 },
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
