import { useMemo, useCallback } from "react";
import { omitBy } from "@/utils/omit";
import { compactDateRangeRequest } from "@/utils/dateRange";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useGetKgExposureEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import {
  KgExposureRequest,
  KgExposureRequestDimension,
} from "@api/types/index";
import type { DateRangeRequest } from "@/api/aliases";

interface UseKgExposureDataParams {
  dimension: KgExposureRequestDimension;
  dateRange: DateRangeRequest;
  sharedFilters: Record<string, string[]>;
  enabled: boolean;
}

export const useKgExposureData = ({
  dimension,
  dateRange,
  sharedFilters,
  enabled,
}: UseKgExposureDataParams) => {
  const { metricFlags } = useMetricFlags();

  const payload: KgExposureRequest = useMemo(
    () => ({
      dimension,
      date_range: {
        ...compactDateRangeRequest(dateRange),
      },
      filters: omitBy(sharedFilters, (item) => !item.length),
    }),
    [dimension, dateRange, sharedFilters]
  );

  const { isFetching: isLoadingInvalidate, refetch: invalidateCache } =
    useGetKgExposureEndpoint(
      payload,
      { ...metricFlags, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const {
    data: response,
    isLoading,
    isError,
    refetch: refetchQuery,
  } = useGetKgExposureEndpoint(payload, metricFlags, {
    query: { enabled },
  });

  const refetch = useCallback(async () => {
    await invalidateCache();
    await refetchQuery();
  }, [invalidateCache, refetchQuery]);

  return { response, isLoading, isError, isLoadingInvalidate, refetch };
};
