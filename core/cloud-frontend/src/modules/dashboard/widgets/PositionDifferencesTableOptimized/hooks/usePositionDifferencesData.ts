import { useMemo, useCallback } from "react";
import { omitBy } from "@/utils/omit";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useGetPositionDifferencesStats } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import { PositionDifferencesRequest } from "@api/types/index";
import { DateRangeRequest } from "@/api/aliases";
import { compactDateRangeRequest } from "@/utils/dateRange";

interface UsePositionDifferencesDataParams {
  dateRange: DateRangeRequest;
  effectiveFundCombination: { fund_1: string; fund_2: string };
  sharedFilters: Record<string, string[]>;
  enabled: boolean;
}

export const usePositionDifferencesData = ({
  dateRange,
  effectiveFundCombination,
  sharedFilters,
  enabled,
}: UsePositionDifferencesDataParams) => {
  const { metricFlags } = useMetricFlags();

  const positionDifferencesPayload: PositionDifferencesRequest = useMemo(() => {
    return {
      date_range: {
        ...compactDateRangeRequest(dateRange),
      },
      fund_1: effectiveFundCombination.fund_1,
      fund_2: effectiveFundCombination.fund_2,
      filters: omitBy(sharedFilters, (item) => !item.length),
    };
  }, [dateRange, effectiveFundCombination, sharedFilters]);

  const { isFetching: isLoadingInvalidate, refetch: invalidateCache } =
    useGetPositionDifferencesStats(
      positionDifferencesPayload,
      { ...metricFlags, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const {
    data: positionDifferencesResponse,
    isLoading,
    refetch,
  } = useGetPositionDifferencesStats(
    positionDifferencesPayload,
    { ...metricFlags },
    {
      query: {
        enabled,
      },
    }
  );

  const data = useMemo(
    () =>
      (positionDifferencesResponse?.data || []) as unknown as Array<
        Record<string, unknown>
      >,
    [positionDifferencesResponse]
  );

  const metadata = useMemo(
    () => positionDifferencesResponse?.metadata,
    [positionDifferencesResponse]
  );

  const refetchData = useCallback(async () => {
    await invalidateCache();
    await refetch();
  }, [invalidateCache, refetch]);

  return {
    data,
    metadata,
    isLoading,
    isLoadingInvalidate,
    refetch: refetchData,
  };
};
