import { useMemo, useCallback } from "react";
import { omitBy } from "@/utils/omit";
import { compactDateRangeRequest } from "@/utils/dateRange";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useGetTopWinnersAndLosersAnalystStats } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import {
  TopWinnersAndLosersAnalystRequest,
  TopWinnersAndLosersAnalystRequestGroupByAnyOfItem,
  TopWinnersAndLosersAnalystResponse,
} from "@/api/types";
import type { TopWinnersAndLosersAnalystRequestTopN } from "@/api/types";
import type { DateRangeRequest } from "@/api/aliases";

interface UseWinnersAndLosersDataParams {
  dateRange: DateRangeRequest;
  topN: TopWinnersAndLosersAnalystRequestTopN;
  groupBy: string;
  sharedFilters: Record<string, string[]>;
  enabled: boolean;
}

export const useWinnersAndLosersData = ({
  dateRange,
  topN,
  groupBy,
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
      group_by: [groupBy as TopWinnersAndLosersAnalystRequestGroupByAnyOfItem],
    }),
    [dateRange, sharedFilters, topN, groupBy]
  );

  const winnersPayload: TopWinnersAndLosersAnalystRequest = useMemo(
    () => ({ ...baseRequest, result_type: "winners" }),
    [baseRequest]
  );

  const losersPayload: TopWinnersAndLosersAnalystRequest = useMemo(
    () => ({ ...baseRequest, result_type: "losers" }),
    [baseRequest]
  );

  const queryOptions = {
    query: { enabled },
  };

  const { isFetching: isLoadingInvalidateWinners, refetch: invalidateWinners } =
    useGetTopWinnersAndLosersAnalystStats(
      winnersPayload,
      { ...metricFlags, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const { isFetching: isLoadingInvalidateLosers, refetch: invalidateLosers } =
    useGetTopWinnersAndLosersAnalystStats(
      losersPayload,
      { ...metricFlags, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const {
    data: winnersResponse,
    isLoading: isLoadingWinners,
    refetch: refetchWinners,
  } = useGetTopWinnersAndLosersAnalystStats(
    winnersPayload,
    metricFlags,
    queryOptions
  );

  const {
    data: losersResponse,
    isLoading: isLoadingLosers,
    refetch: refetchLosers,
  } = useGetTopWinnersAndLosersAnalystStats(
    losersPayload,
    metricFlags,
    queryOptions
  );

  const winnersResponses: TopWinnersAndLosersAnalystResponse[] = useMemo(
    () => winnersResponse ?? [],
    [winnersResponse]
  );

  const losersResponses: TopWinnersAndLosersAnalystResponse[] = useMemo(
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
