import { omitBy } from "@/utils/omit";
import { MetricCatalogItem as MetricCatalogItem } from "@api/types";
import { useMemo } from "react";
import { createMetricRequest } from "../components/PortfolioSummaryTable/PortfolioSummaryTable.utils";
import { Filters } from "@/typings/Filters";
import { MetricFlags } from "@/typings/MetricFlags";
import { useGetPortfolioMetricsV3 } from "@/hooks/api/useGetPortfolioMetric";

export interface UsePortfolioSummaryProps {
  startDate?: string;
  endDate?: string;
  metricsCatalog: MetricCatalogItem[];
  sharedFilters: Filters;
  groupBy: string;
  defaultSubgroupBy: string;
  defaultSubgroupByFallback: string;
  metricFlags: MetricFlags;
  groupingLevelsConfig: string[];
}

export const usePortfolioSummary = ({
  startDate,
  endDate,
  metricsCatalog,
  sharedFilters,
  groupBy,
  defaultSubgroupBy,
  defaultSubgroupByFallback,
  metricFlags,
  groupingLevelsConfig,
}: UsePortfolioSummaryProps) => {
  const groupingStrategies = useMemo(() => {
    const baseStrategies = [
      [groupBy],
      groupBy === defaultSubgroupBy
        ? [defaultSubgroupBy, defaultSubgroupByFallback]
        : [defaultSubgroupBy, groupBy],
    ];

    if (groupingLevelsConfig.length === 0) {
      return baseStrategies;
    }

    const effectiveGroupingLevels =
      groupBy === defaultSubgroupBy
        ? groupingLevelsConfig.filter(
            (level) => level !== defaultSubgroupByFallback
          )
        : groupingLevelsConfig;

    const extendedStrategies = [];
    for (let i = 1; i <= effectiveGroupingLevels.length; i++) {
      const currentLevels = effectiveGroupingLevels.slice(0, i);
      const strategy =
        groupBy === defaultSubgroupBy
          ? [defaultSubgroupBy, defaultSubgroupByFallback, ...currentLevels]
          : [defaultSubgroupBy, groupBy, ...currentLevels];
      extendedStrategies.push(strategy);
    }

    return [...baseStrategies, ...extendedStrategies];
  }, [
    groupBy,
    defaultSubgroupBy,
    defaultSubgroupByFallback,
    groupingLevelsConfig,
  ]);

  const metricRequests = useMemo(
    () =>
      groupingStrategies.map((groupBy) =>
        createMetricRequest({
          startDate,
          endDate,
          metricsCatalog,
          filters: omitBy(sharedFilters, (item) => !item.length),
          groupBy,
        })
      ),
    [groupingStrategies, startDate, endDate, metricsCatalog, sharedFilters]
  );

  const {
    data: portfolioMetricsData,
    isLoading: isLoadingPortfolioSummary,
    refetch: refetchPortfolioSummary,
  } = useGetPortfolioMetricsV3(metricRequests, metricFlags, {
    query: { enabled: !!metricsCatalog.length },
  });

  const {
    isLoading: isLoadingPortfolioSummaryInvalidate,
    refetch: invalidateCache,
  } = useGetPortfolioMetricsV3(
    metricRequests,
    { ...metricFlags, invalidate_cache: true },
    {
      query: { enabled: false },
    }
  );

  return {
    portfolioMetricsData,
    isLoadingPortfolioSummary,
    refetchPortfolioSummary,
    isLoadingPortfolioSummaryInvalidate,
    invalidateCache,
  };
};
