import { useMemo, useCallback } from "react";
import { omitBy } from "@/utils/omit";
import { compactDateRangeRequest } from "@/utils/dateRange";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useGetBattingSluggingStats } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import {
  BattingSluggingRequest,
  BattingSluggingRequestGroupByAnyOfItem,
  CommonFilters,
} from "@api/types/index";
import { DateRangeRequest } from "@/api/aliases";
import { computeTotalFromResponses } from "../BattingAndSluggingTable.utils";

interface UseBattingSluggingDataParams {
  dateRange: DateRangeRequest;
  effectiveGroupBy: string;
  sharedFilters: Record<string, string[]>;
  enabled?: boolean;
}

const mapFilters = (filters: Record<string, string[]>): CommonFilters =>
  omitBy(filters, (v) => !v?.length) as CommonFilters;

export const useBattingSluggingData = ({
  dateRange,
  effectiveGroupBy,
  sharedFilters,
  enabled = true,
}: UseBattingSluggingDataParams) => {
  const { metricFlags } = useMetricFlags();

  const baseRequest = useMemo(
    (): Omit<BattingSluggingRequest, "group_by"> => ({
      date_range: {
        ...compactDateRangeRequest(dateRange),
      },
      filters: mapFilters(sharedFilters),
    }),
    [dateRange, sharedFilters]
  );

  const queryParams = { explode_composites: metricFlags.explode_composites };

  const request = useMemo(
    () => ({
      ...baseRequest,
      group_by: [effectiveGroupBy as BattingSluggingRequestGroupByAnyOfItem],
    }),
    [baseRequest, effectiveGroupBy]
  );

  const { isFetching: isLoadingInvalidate, refetch: invalidateCache } =
    useGetBattingSluggingStats(
      request,
      { ...queryParams, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const {
    data: response,
    isLoading: isLoadingData,
    refetch: refetchQuery,
  } = useGetBattingSluggingStats(request, queryParams, { query: { enabled } });

  const responses = useMemo(() => response ?? [], [response]);

  const totalData = useMemo(
    () => computeTotalFromResponses(responses, effectiveGroupBy),
    [responses, effectiveGroupBy]
  );

  const refetchAll = useCallback(async () => {
    await invalidateCache();
    await refetchQuery();
  }, [invalidateCache, refetchQuery]);

  return {
    responses,
    totalData,
    isLoading: isLoadingData,
    isLoadingInvalidate,
    refetch: refetchAll,
  };
};
