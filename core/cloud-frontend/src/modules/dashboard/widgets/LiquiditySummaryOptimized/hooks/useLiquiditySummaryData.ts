import { useMemo, useCallback } from "react";
import { omitBy } from "@/utils/omit";
import { compactDateRangeRequest } from "@/utils/dateRange";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useGetLiquiditySummaryStatsEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import {
  LiquiditySummaryRequest,
  LiquiditySummaryResponse,
} from "@api/types/index";
import type { DateRangeRequest } from "@/api/aliases";

interface UseLiquiditySummaryDataParams {
  dateRange: DateRangeRequest;
  sharedFilters: Record<string, string[]>;
  enabled: boolean;
}

export const useLiquiditySummaryData = ({
  dateRange,
  sharedFilters,
  enabled,
}: UseLiquiditySummaryDataParams) => {
  const { metricFlags } = useMetricFlags();

  const payload: LiquiditySummaryRequest = useMemo(
    () => ({
      date_range: {
        ...compactDateRangeRequest(dateRange),
      },
      filters: omitBy(sharedFilters, (item) => !item.length),
    }),
    [dateRange, sharedFilters]
  );

  const { isFetching: isLoadingInvalidate, refetch: invalidateCache } =
    useGetLiquiditySummaryStatsEndpoint(
      payload,
      { ...metricFlags, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const {
    data: response,
    isLoading,
    refetch,
  } = useGetLiquiditySummaryStatsEndpoint(payload, metricFlags, {
    query: { enabled },
  });

  const responses: LiquiditySummaryResponse[] = useMemo(
    () => response ?? [],
    [response]
  );

  const refetchData = useCallback(async () => {
    await invalidateCache();
    await refetch();
  }, [invalidateCache, refetch]);

  return {
    responses,
    isLoading,
    isLoadingInvalidate,
    refetch: refetchData,
  };
};
