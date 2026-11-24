import { useMemo, useCallback } from "react";
import { omitBy } from "@/utils/omit";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useGetMonthlyPerformanceStats } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import {
  MonthlyPerformanceRequest,
  MonthlyPerformanceRequestGroupByItem,
} from "@api/types/index";
import { Filters } from "@/typings/Filters";

interface UseMonthlyPerformanceDataParams {
  groupBy: MonthlyPerformanceRequestGroupByItem;
  year: number;
  sharedFilters: Filters;
  enabled: boolean;
}

export const useMonthlyPerformanceData = ({
  groupBy,
  year,
  sharedFilters,
  enabled,
}: UseMonthlyPerformanceDataParams) => {
  const { metricFlags } = useMetricFlags();

  const payload: MonthlyPerformanceRequest = useMemo(
    () => ({
      group_by: [groupBy],
      year,
      filters: omitBy(sharedFilters, (item) => !item.length),
    }),
    [groupBy, year, sharedFilters]
  );

  const { isFetching: isLoadingInvalidate, refetch: invalidateCache } =
    useGetMonthlyPerformanceStats(
      payload,
      { ...metricFlags, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const {
    data: response,
    isLoading,
    refetch,
  } = useGetMonthlyPerformanceStats(payload, metricFlags, {
    query: { enabled },
  });

  const refetchData = useCallback(async () => {
    await invalidateCache();
    await refetch();
  }, [invalidateCache, refetch]);

  return {
    response,
    isLoading,
    isLoadingInvalidate,
    refetch: refetchData,
  };
};
