import { useMemo } from "react";

import { useGetPortfolioMetricsV3 } from "@/hooks/api/useGetPortfolioMetric";
import { MetricMetadata } from "@api/types/index";
import { Filters } from "@/typings/Filters";
import { omitBy } from "@/utils/omit";
import {
  MetricRequest,
  MetricResult,
  MetricResultData,
  MetricResultDataAnyOfItem,
} from "@/api/types";

export interface UseTotalMetricsProps {
  groupBy: string;
  totalMetric: string;
  metricsCatalogData?: MetricMetadata;
  dateRanges: { start: string; end: string };
  sharedFilters: Filters;
  metricFlags: Partial<Record<"explode_composites" | "idea_tracker", boolean>>;
}

export const useTotalMetrics = ({
  groupBy,
  totalMetric,
  metricsCatalogData,
  dateRanges,
  sharedFilters,
  metricFlags,
}: UseTotalMetricsProps) => {
  const metricsCatalogUnfiltered = useMemo(
    () => metricsCatalogData?.metrics || [],
    [metricsCatalogData]
  );

  const metricsCatalog = useMemo(() => {
    return metricsCatalogUnfiltered.filter(
      (metric) =>
        metric.name === totalMetric || metric.name === "primary_analyst_avatar"
    );
  }, [metricsCatalogUnfiltered, totalMetric]);

  const filterKey = useMemo(() => groupBy, [groupBy]);

  const options = useMemo(() => {
    return metricsCatalogData?.filterable_by?.find(
      (item) => item.name === filterKey
    )?.filterable_values;
  }, [metricsCatalogData, filterKey]);

  const totalPayload: MetricRequest = useMemo(() => {
    return {
      start_date: dateRanges.start,
      end_date: dateRanges.end,
      metrics: metricsCatalog.map((option) => ({ name: option.name })),
      group_by: [groupBy],
      filters: omitBy(sharedFilters, (item) => !item.length),
    };
  }, [dateRanges, metricsCatalog, groupBy, sharedFilters]);

  const requests: MetricRequest[] = useMemo(() => {
    const processedFilters = omitBy(sharedFilters, (item) => !item.length);

    const selectedOptions = processedFilters[filterKey] || [];
    const filteredOptions = (options || []).filter(
      (option) =>
        selectedOptions.length === 0 ||
        selectedOptions.includes(option as string)
    );

    return filteredOptions.map((option) => ({
      ...totalPayload,
      filters: {
        ...processedFilters,
        [filterKey]: [option],
      },
    }));
  }, [options, totalPayload, filterKey, sharedFilters]);

  const {
    data: totalDataRaw,
    isLoading: isLoadingTotal,
    refetch: refetchTotal,
  } = useGetPortfolioMetricsV3(requests, metricFlags, {
    query: { enabled: !!metricsCatalog.length },
  });

  const { isLoading: isLoadingTotalInvalidate, refetch: invalidateCacheTotal } =
    useGetPortfolioMetricsV3(
      requests,
      { ...metricFlags, invalidate_cache: true },
      {
        query: {
          enabled: false,
        },
      }
    );

  const totalDataParsed = useMemo(() => {
    return (totalDataRaw || []).map(
      (item) => item.data?.[0] as MetricResultDataAnyOfItem
    );
  }, [totalDataRaw]);

  const totalData: Pick<MetricResult, "data"> = useMemo(() => {
    return {
      data: orderIfFund(totalDataParsed, filterKey),
    };
  }, [totalDataParsed, filterKey]);

  return {
    totalData,
    isLoadingTotal,
    refetchTotal,
    isLoadingTotalInvalidate,
    invalidateCacheTotal,
  };
};

const orderIfFund = (
  data: MetricResultDataAnyOfItem[],
  filterKey: string
): MetricResultData => {
  const preferredOrder = ["Flagship", "Innovation", "DemoBio"];
  const res: MetricResultDataAnyOfItem[] = (data || [])?.sort((a, b) => {
    const aIndex = preferredOrder.indexOf(a?.[filterKey] as string);
    const bIndex = preferredOrder.indexOf(b?.[filterKey] as string);
    return aIndex - bIndex;
  });

  return res;
};
