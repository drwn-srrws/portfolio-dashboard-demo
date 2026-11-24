import { useMemo, useCallback } from "react";
import { omitBy } from "@/utils/omit";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useGetHistPerfMonthlyAlphaPerfStats } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import {
  HistPerfMonthlyAlphaPerfRequest,
  HistPerfMonthlyAlphaPerfRequestGroupByItem,
} from "@api/types/index";
import { Filters } from "@/typings/Filters";

interface UseHistoricalMonthlyAlphaPerfDataParams {
  groupBy: string;
  year: number;
  benchmarkId: string;
  metric?: string;
  sharedFilters: Filters;
  enabled: boolean;
}

export const useHistoricalMonthlyAlphaPerfData = ({
  groupBy,
  year,
  benchmarkId,
  metric,
  sharedFilters,
  enabled,
}: UseHistoricalMonthlyAlphaPerfDataParams) => {
  const { metricFlags } = useMetricFlags();

  const payload: HistPerfMonthlyAlphaPerfRequest = useMemo(
    () => ({
      group_by: [groupBy as HistPerfMonthlyAlphaPerfRequestGroupByItem],
      year,
      benchmark_id: benchmarkId || undefined,
      metric: metric ?? null,
      filters: omitBy(sharedFilters, (item) => !item.length),
    }),
    [groupBy, year, benchmarkId, metric, sharedFilters]
  );

  const { isFetching: isLoadingInvalidate, refetch: invalidateCache } =
    useGetHistPerfMonthlyAlphaPerfStats(
      payload,
      { ...metricFlags, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const {
    data: response,
    isLoading,
    refetch,
  } = useGetHistPerfMonthlyAlphaPerfStats(payload, metricFlags, {
    query: { enabled: enabled && !!benchmarkId },
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
