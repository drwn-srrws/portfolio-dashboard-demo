import { useCallback, useMemo } from "react";

import { useGetLtdAlphaYearlyAlphaPerfStats } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import type {
  CommonFilters,
  LTDAlphaYearlyAlphaPerfRequest,
} from "@/api/types";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { hyphenatedDate } from "@/utils/dates";

import { LTD_START_DATE } from "../YearlyAlphaPnLByAnalystTable.utils";

interface UseYearlyAlphaPnLByAnalystDataParams {
  benchmarkId: string | null;
  filters: CommonFilters;
  enabled: boolean;
}

/**
 * Wraps ``useGetLtdAlphaYearlyAlphaPerfStats`` to request the analyst-grouped
 * variant (``group_by: ["primary_analyst"]``) with the LTD window
 * (2021-01-01 → today). One benchmark per request — the card has a single
 * benchmark dropdown.
 */
export const useYearlyAlphaPnLByAnalystData = ({
  benchmarkId,
  filters,
  enabled,
}: UseYearlyAlphaPnLByAnalystDataParams) => {
  const { metricFlags } = useMetricFlags();

  const payload: LTDAlphaYearlyAlphaPerfRequest = useMemo(
    () => ({
      date_range: {
        start_date: LTD_START_DATE,
        end_date: hyphenatedDate(new Date()),
      },
      filters,
      benchmark_ids: benchmarkId ? [benchmarkId] : [],
      group_by: ["primary_analyst"],
    }),
    [benchmarkId, filters]
  );

  const { isFetching: isLoadingInvalidate, refetch: invalidateCache } =
    useGetLtdAlphaYearlyAlphaPerfStats(
      payload,
      { ...metricFlags, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetLtdAlphaYearlyAlphaPerfStats(payload, metricFlags, {
    query: { enabled: enabled && !!benchmarkId },
  });

  const refetchData = useCallback(async () => {
    await invalidateCache();
    await refetch();
  }, [invalidateCache, refetch]);

  return {
    response: response ?? null,
    isLoading,
    isFetching,
    isLoadingInvalidate,
    refetch: refetchData,
  };
};
