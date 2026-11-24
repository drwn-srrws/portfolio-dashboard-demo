import { useMemo, useCallback } from "react";
import { omitBy } from "@/utils/omit";
import { compactDateRangeRequest } from "@/utils/dateRange";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useGetPerformanceOverviewStats } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import {
  PerformanceOverviewRequestGroupByItem,
  PerformanceOverviewStats,
} from "@api/types";
import type { DateRangeRequest } from "@/api/aliases";
import { isAlphaMetric } from "../utils";

interface UsePerformanceOverviewDataParams {
  dateRange: DateRangeRequest;
  selectedGroupBy: string;
  combinedFilters: Record<string, string[]>;
  enabled: boolean;
  displayMetric?: string;
  benchmarkId?: string;
}

export const usePerformanceOverviewData = ({
  dateRange,
  selectedGroupBy,
  combinedFilters,
  enabled,
  displayMetric,
  benchmarkId,
}: UsePerformanceOverviewDataParams) => {
  const { metricFlags } = useMetricFlags();

  const needsBenchmark = !!benchmarkId && isAlphaMetric(displayMetric ?? "");

  const performanceRequest = useMemo(() => {
    return {
      date_range: {
        ...compactDateRangeRequest(dateRange),
      },
      filters: omitBy(combinedFilters, (item) => !item.length),
      group_by: [
        "date" as PerformanceOverviewRequestGroupByItem,
        selectedGroupBy as PerformanceOverviewRequestGroupByItem,
      ],
      ...(displayMetric ? { metric: displayMetric } : {}),
      ...(needsBenchmark ? { benchmark_id: benchmarkId } : {}),
    };
  }, [
    dateRange,
    combinedFilters,
    selectedGroupBy,
    displayMetric,
    needsBenchmark,
    benchmarkId,
  ]);

  const { isFetching: isLoadingInvalidate, refetch: invalidateCache } =
    useGetPerformanceOverviewStats(
      performanceRequest,
      { ...metricFlags, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const {
    data: performanceData,
    isLoading,
    refetch: refetchQuery,
  } = useGetPerformanceOverviewStats(performanceRequest, metricFlags, {
    query: {
      enabled,
    },
  });

  const data = useMemo(
    () =>
      (performanceData?.flatMap((r) => r.data) ||
        []) as unknown as Array<PerformanceOverviewStats>,
    [performanceData]
  );

  const metadata = useMemo(
    () => performanceData?.[0]?.metadata,
    [performanceData]
  );

  const refetchData = useCallback(async () => {
    await invalidateCache();
    await refetchQuery();
  }, [invalidateCache, refetchQuery]);

  return {
    data,
    metadata,
    isLoading,
    isLoadingInvalidate,
    refetch: refetchData,
  };
};
