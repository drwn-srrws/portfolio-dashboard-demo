import { useMemo, useCallback } from "react";
import { omitBy } from "@/utils/omit";
import { compactDateRangeRequest } from "@/utils/dateRange";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useGetMarketCapDistributionStatsEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import {
  MarketCapDistributionRequest,
  MarketCapDistributionResponse,
} from "@api/types/index";
import type { DateRangeRequest } from "@/api/aliases";

interface UseMarketCapDistributionDataParams {
  dateRange: DateRangeRequest;
  sharedFilters: Record<string, string[]>;
  enabled: boolean;
}

export const useMarketCapDistributionData = ({
  dateRange,
  sharedFilters,
  enabled,
}: UseMarketCapDistributionDataParams) => {
  const { metricFlags } = useMetricFlags();

  const payload: MarketCapDistributionRequest = useMemo(
    () => ({
      date_range: {
        ...compactDateRangeRequest(dateRange),
      },
      filters: omitBy(sharedFilters, (item) => !item.length),
    }),
    [dateRange, sharedFilters]
  );

  const { isFetching: isLoadingInvalidate, refetch: invalidateCache } =
    useGetMarketCapDistributionStatsEndpoint(
      payload,
      { ...metricFlags, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const {
    data: response,
    isLoading,
    refetch,
  } = useGetMarketCapDistributionStatsEndpoint(payload, metricFlags, {
    query: { enabled },
  });

  const responses: MarketCapDistributionResponse[] = useMemo(
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
