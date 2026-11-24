import { useMemo, useCallback } from "react";
import { omitBy } from "@/utils/omit";
import { compactDateRangeRequest } from "@/utils/dateRange";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useGetTopWinnersAndLosersInvestmentStats } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import {
  TopWinnersAndLosersInvestmentRequest,
  TopWinnersAndLosersInvestmentResponse,
} from "@/api/types";
import type { TopWinnersAndLosersInvestmentRequestTopN } from "@/api/types";
import type { DateRangeRequest } from "@/api/aliases";

interface UseWinnersAndLosersDataParams {
  dateRange: DateRangeRequest;
  topN: TopWinnersAndLosersInvestmentRequestTopN;
  sharedFilters: Record<string, string[]>;
  enabled: boolean;
}

export const useWinnersAndLosersData = ({
  dateRange,
  topN,
  sharedFilters,
  enabled,
}: UseWinnersAndLosersDataParams) => {
  const { metricFlags } = useMetricFlags();

  const baseRequest = useMemo(
    () => ({
      date_range: {
        ...compactDateRangeRequest(dateRange),
      },
      filters: omitBy(sharedFilters, (item) => !item.length),
      top_n: topN,
    }),
    [dateRange, sharedFilters, topN]
  );

  const winnersPayload: TopWinnersAndLosersInvestmentRequest = useMemo(
    () => ({ ...baseRequest, result_type: "winners" }),
    [baseRequest]
  );

  const losersPayload: TopWinnersAndLosersInvestmentRequest = useMemo(
    () => ({ ...baseRequest, result_type: "losers" }),
    [baseRequest]
  );

  const queryOptions = {
    query: { enabled },
  };

  const { isFetching: isLoadingInvalidateWinners, refetch: invalidateWinners } =
    useGetTopWinnersAndLosersInvestmentStats(
      winnersPayload,
      { ...metricFlags, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const { isFetching: isLoadingInvalidateLosers, refetch: invalidateLosers } =
    useGetTopWinnersAndLosersInvestmentStats(
      losersPayload,
      { ...metricFlags, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const {
    data: winnersResponse,
    isLoading: isLoadingWinners,
    refetch: refetchWinners,
  } = useGetTopWinnersAndLosersInvestmentStats(
    winnersPayload,
    metricFlags,
    queryOptions
  );

  const {
    data: losersResponse,
    isLoading: isLoadingLosers,
    refetch: refetchLosers,
  } = useGetTopWinnersAndLosersInvestmentStats(
    losersPayload,
    metricFlags,
    queryOptions
  );

  const winnersResponses: TopWinnersAndLosersInvestmentResponse[] = useMemo(
    () => winnersResponse ?? [],
    [winnersResponse]
  );

  const losersResponses: TopWinnersAndLosersInvestmentResponse[] = useMemo(
    () => losersResponse ?? [],
    [losersResponse]
  );

  const isLoadingInvalidate =
    isLoadingInvalidateWinners || isLoadingInvalidateLosers;

  const refetchData = useCallback(async () => {
    await Promise.all([invalidateWinners(), invalidateLosers()]);
    await Promise.all([refetchWinners(), refetchLosers()]);
  }, [invalidateWinners, invalidateLosers, refetchWinners, refetchLosers]);

  return {
    winnersResponses,
    losersResponses,
    isLoading: isLoadingWinners || isLoadingLosers,
    isLoadingInvalidate,
    refetch: refetchData,
  };
};
