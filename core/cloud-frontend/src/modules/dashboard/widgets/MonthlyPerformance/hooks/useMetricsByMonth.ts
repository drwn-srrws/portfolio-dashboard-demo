import { useCallback, useMemo } from "react";

import { useGetPortfolioMetricsV3 } from "@/hooks/api/useGetPortfolioMetric";
import { Filters } from "@/typings/Filters";
import { omitBy } from "@/utils/omit";
import {
  MetricResult,
  MetricResultData,
  MetricRequest,
  MetricMetadata,
  MetricRequestEndDate,
  MetricRequestStartDate,
} from "@/api/types";

export interface UseMetricsByMonthOptions {
  groupBy: string;
  totalMetric: string;
  metricsCatalogData?: MetricMetadata;
  dateRanges: { start: string; end: string }[];
  sharedFilters: Filters;
  metricFlags: Partial<Record<"explode_composites" | "idea_tracker", boolean>>;
}

export const useMetricsByMonth = ({
  groupBy,
  totalMetric,
  metricsCatalogData,
  dateRanges,
  sharedFilters,
  metricFlags,
}: UseMetricsByMonthOptions) => {
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

  const requests: MetricRequest[] = useMemo(() => {
    const processedFilters = omitBy(sharedFilters, (item) => !item.length);

    const selectedOptions = processedFilters[filterKey] || [];
    const filteredOptions = (options || []).filter(
      (option) =>
        selectedOptions.length === 0 ||
        selectedOptions.includes(option as string)
    );

    return filteredOptions
      .map((option) =>
        dateRanges.map(({ start, end }) => ({
          start_date: start,
          end_date: end,
          metrics: metricsCatalog.map((option) => ({ name: option.name })),
          group_by: [groupBy],
          filters: {
            ...processedFilters,
            [filterKey]: [option],
          },
        }))
      )
      .flat();
  }, [options, dateRanges, metricsCatalog, groupBy, sharedFilters, filterKey]);

  const {
    data: byMonthDataRaw,
    isLoading: isLoadingByMonth,
    refetch: refetchByMonth,
  } = useGetPortfolioMetricsV3(requests, metricFlags, {
    query: { enabled: !!metricsCatalog.length },
  });

  const {
    isLoading: isLoadingByMonthInvalidate,
    refetch: invalidateCacheByMonth,
  } = useGetPortfolioMetricsV3(
    requests,
    { ...metricFlags, invalidate_cache: true },
    {
      query: {
        enabled: false,
      },
    }
  );

  const groupByDate = useCallback(
    (byMonthRawWithDates: ByMonthRawWithDates[]) => {
      return byMonthRawWithDates.reduce(
        (acc: Record<string, MetricResultData>, curr) => {
          const index = curr.start_date as string;

          return {
            ...acc,
            [index]: [...(acc?.[index] || []), ...(curr.data || [])],
          };
        },
        {}
      );
    },
    []
  );

  const byMonthData: Pick<MetricResult, "data">[] = useMemo(() => {
    const byMonthRawWithDates: ByMonthRawWithDates[] = (
      byMonthDataRaw || []
    )?.map((item, index) => {
      return {
        ...item,
        start_date: requests?.[index]?.start_date,
        end_date: requests?.[index]?.end_date,
      };
    });

    const byMonthGroupByDate = groupByDate(byMonthRawWithDates);

    const result: Pick<MetricResult, "data">[] = Object.values(
      byMonthGroupByDate
    ).map((item) => {
      const r = item?.map((item) => {
        return item;
      });

      return {
        data: r,
      };
    });

    return result;
  }, [byMonthDataRaw, groupByDate, requests]);

  return {
    byMonthData,
    isLoadingByMonth,
    refetchByMonth,
    isLoadingByMonthInvalidate,
    invalidateCacheByMonth,
  };
};

type ByMonthRawWithDates = {
  start_date: MetricRequestStartDate | undefined;
  end_date: MetricRequestEndDate | undefined;
  data?: MetricResultData;
};
