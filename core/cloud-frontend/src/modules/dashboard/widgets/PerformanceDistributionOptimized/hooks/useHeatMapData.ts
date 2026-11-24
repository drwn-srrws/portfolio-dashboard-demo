import { useMemo, useCallback } from "react";
import { omitBy } from "@/utils/omit";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useGetHeatMapsStats } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import { HeatMapsRequest, HeatMapsRequestGroupByItem } from "@api/types/index";
import { HeatMapConfig } from "./useHeatMapConfig";
import type { DateRangeRequest } from "@/api/aliases";

interface UseHeatMapDataParams {
  dateRange: DateRangeRequest;
  effectiveGroupBy: string;
  sharedFilters: Record<string, string[]>;
  config: HeatMapConfig;
  enabled: boolean;
}

export const useHeatMapData = ({
  dateRange,
  effectiveGroupBy,
  sharedFilters,
  config,
  enabled,
}: UseHeatMapDataParams) => {
  const { metricFlags } = useMetricFlags();

  const heatMapsPayload: HeatMapsRequest = useMemo(() => {
    const groupBy: HeatMapsRequestGroupByItem[] = [
      ...config.requiredDimensions.map(
        (dimension) => dimension as HeatMapsRequestGroupByItem
      ),
    ];

    if (
      effectiveGroupBy &&
      !config.requiredDimensions.includes(effectiveGroupBy)
    ) {
      groupBy.push(effectiveGroupBy as HeatMapsRequestGroupByItem);
    }

    return {
      date_range: dateRange,
      group_by: groupBy,
      filters: omitBy(sharedFilters, (item) => !item.length),
      sort: {
        sort_by: effectiveGroupBy ? [effectiveGroupBy] : [],
        sort_descending: false,
      },
    };
  }, [dateRange, effectiveGroupBy, sharedFilters, config.requiredDimensions]);

  const queryParams = { explode_composites: metricFlags.explode_composites };

  const { isFetching: isLoadingInvalidate, refetch: invalidateCache } =
    useGetHeatMapsStats(
      heatMapsPayload,
      { ...queryParams, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const {
    data: heatMapsResponse,
    isLoading: isLoadingData,
    refetch,
  } = useGetHeatMapsStats(heatMapsPayload, queryParams, {
    query: { enabled },
  });

  const data = useMemo(
    () =>
      (heatMapsResponse?.data || []) as unknown as Array<
        Record<string, unknown>
      >,
    [heatMapsResponse]
  );

  const refetchData = useCallback(async () => {
    await invalidateCache();
    await refetch();
  }, [invalidateCache, refetch]);

  return {
    data,
    isLoading: isLoadingData,
    isLoadingInvalidate,
    refetch: refetchData,
  };
};
