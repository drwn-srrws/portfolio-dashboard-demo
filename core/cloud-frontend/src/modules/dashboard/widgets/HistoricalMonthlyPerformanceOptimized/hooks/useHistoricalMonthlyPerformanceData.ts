import { useMemo, useCallback } from "react";
import { omitBy } from "@/utils/omit";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useGetHistoricalPerfMonthlyPerfStats } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import {
  HistoricalPerfMonthlyPerfRequest,
  HistoricalPerfMonthlyPerfRequestGroupByItem,
} from "@api/types/index";
import { Filters } from "@/typings/Filters";

interface UseHistoricalMonthlyPerformanceDataParams {
  groupBy: string;
  year: number;
  sharedFilters: Filters;
  enabled: boolean;
}

export const useHistoricalMonthlyPerformanceData = ({
  groupBy,
  year,
  sharedFilters,
  enabled,
}: UseHistoricalMonthlyPerformanceDataParams) => {
  const { metricFlags } = useMetricFlags();

  const payload: HistoricalPerfMonthlyPerfRequest = useMemo(
    () => ({
      group_by: [groupBy as HistoricalPerfMonthlyPerfRequestGroupByItem],
      year,
      filters: omitBy(sharedFilters, (item) => !item.length),
    }),
    [groupBy, year, sharedFilters]
  );

  const { isFetching: isLoadingInvalidate, refetch: invalidateCache } =
    useGetHistoricalPerfMonthlyPerfStats(
      payload,
      { ...metricFlags, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const {
    data: response,
    isLoading,
    refetch,
  } = useGetHistoricalPerfMonthlyPerfStats(payload, metricFlags, {
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
