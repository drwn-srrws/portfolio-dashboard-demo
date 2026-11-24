import { useCallback, useMemo } from "react";

import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { useGetPortfolioMetricsV3 } from "@/hooks/api/useGetPortfolioMetric";
import { Filters } from "@/typings/Filters";
import { omitBy } from "@/utils/omit";
import {
  flattenFourLevelHierarchy,
  flattenThreeLevelHierarchy,
  formatDataToNestedTableData,
} from "@/utils/table";

import {
  createMetricRequest,
  getLosersList,
  getWinnersList,
} from "../components/WinnersAndLosersTable/WinnersAndLosersTable.utils";
import { MetricMetadata } from "@/api/types";
import { getFilterOptions } from "@/components/FilterController/utils";
import { MetricFlags } from "@/typings/MetricFlags";

const POSITION_INSTRUMENT_NAME = "position_instrument_security_code";

export interface UseWinnersAndLosersOptions {
  selection: { groupBy: string; top: string };
  startDate?: string;
  endDate?: string;
  metricFlags: MetricFlags;
  filters: Filters;
  sortByMetric: string;
  defaultSubgroupBy: string;
  defaultSubgroupByFallback: string;
  metrics?: string[];
}

export const useWinnersAndLosers = ({
  selection,
  startDate,
  endDate,
  metricFlags,
  filters,
  sortByMetric,
  defaultSubgroupBy,
  defaultSubgroupByFallback,
  metrics,
}: UseWinnersAndLosersOptions) => {
  const { data: metricsCatalogData, isLoading: isLoadingCatalog } =
    useGetPortfolioMetricCatalogV3({
      ...metricFlags,
      include_filterable_values: true,
    });

  const filterOptions = useMemo(() => {
    return getFilterOptions(metricsCatalogData as MetricMetadata);
  }, [metricsCatalogData]);

  const metricsCatalogUnfiltered = useMemo(
    () => metricsCatalogData?.metrics || [],
    [metricsCatalogData]
  );

  const metricsCatalog = useMemo(() => {
    return metricsCatalogUnfiltered.filter(
      (metric) => metrics?.includes(metric.name) || metric.name === sortByMetric
    );
  }, [metricsCatalogUnfiltered, metrics, sortByMetric]);

  const groupingStrategies = useMemo(() => {
    const isDefaultGroupBy = selection.groupBy === defaultSubgroupBy;
    const isGroupByFallback = selection.groupBy === defaultSubgroupByFallback;

    const baseLevels = [
      [selection.groupBy],
      isDefaultGroupBy || isGroupByFallback
        ? [defaultSubgroupBy, defaultSubgroupByFallback]
        : [defaultSubgroupBy, selection.groupBy],
    ];

    const thirdLevel =
      !isDefaultGroupBy && !isGroupByFallback
        ? [[defaultSubgroupBy, selection.groupBy, defaultSubgroupByFallback]]
        : [];

    const fourthLevel = metricFlags.explode_composites
      ? [
          isDefaultGroupBy || isGroupByFallback
            ? [
                defaultSubgroupBy,
                defaultSubgroupByFallback,
                POSITION_INSTRUMENT_NAME,
              ]
            : [
                defaultSubgroupBy,
                selection.groupBy,
                defaultSubgroupByFallback,
                POSITION_INSTRUMENT_NAME,
              ],
        ]
      : [];

    return [...baseLevels, ...thirdLevel, ...fourthLevel];
  }, [
    selection.groupBy,
    defaultSubgroupBy,
    defaultSubgroupByFallback,
    metricFlags.explode_composites,
  ]);

  const metricRequests = useMemo(() => {
    return groupingStrategies.map((groupBy) =>
      createMetricRequest({
        startDate,
        endDate,
        metricsCatalog,
        filters: omitBy(filters, (item) => !item.length),
        groupBy,
      })
    );
  }, [groupingStrategies, startDate, endDate, metricsCatalog, filters]);

  const {
    data: winnersAndLosers,
    isLoading: isLoadingWinnersAndLosers,
    refetch: refetchWinnersAndLosers,
  } = useGetPortfolioMetricsV3(metricRequests, metricFlags, {
    query: {
      enabled: !!metricsCatalog.length,
    },
  });

  const {
    isLoading: isLoadingWinnersAndLosersInvalidate,
    refetch: invalidateCache,
  } = useGetPortfolioMetricsV3(
    metricRequests,
    { ...metricFlags, invalidate_cache: true },
    {
      query: {
        enabled: false,
      },
    }
  );

  const winnersAndLosersLevel1Data = useMemo(
    () => winnersAndLosers?.[0]?.data || [],
    [winnersAndLosers]
  );

  const winnersAndLosersLevel2Data = useMemo(
    () => winnersAndLosers?.[1]?.data || [],
    [winnersAndLosers]
  );

  const winnersAndLosersLevel3Data = useMemo(
    () => winnersAndLosers?.[2]?.data || [],
    [winnersAndLosers]
  );

  const winnersAndLosersLevel4Data = useMemo(
    () => winnersAndLosers?.[3]?.data || [],
    [winnersAndLosers]
  );

  const sortedWinnersTopLevelData = useMemo(() => {
    return getWinnersList(
      winnersAndLosersLevel1Data,
      selection.top === "all" ? "all" : Number(selection.top),
      sortByMetric
    );
  }, [winnersAndLosersLevel1Data, selection.top, sortByMetric]);

  const sortedLosersTopLevelData = useMemo(() => {
    return getLosersList(
      winnersAndLosersLevel1Data,
      selection.top === "all" ? "all" : Number(selection.top),
      sortByMetric
    );
  }, [winnersAndLosersLevel1Data, selection.top, sortByMetric]);

  const buildHierarchicalRows = useCallback(
    (sortOrder: "asc" | "desc", topLevelData: Record<string, unknown>[]) => {
      const isDefaultGroupBy = selection.groupBy === defaultSubgroupBy;
      const isGroupByFallback = selection.groupBy === defaultSubgroupByFallback;

      if (isDefaultGroupBy || isGroupByFallback) {
        return metricFlags.explode_composites
          ? flattenThreeLevelHierarchy({
              sortOrder,
              top: topLevelData,
              mid: winnersAndLosersLevel2Data,
              last: winnersAndLosersLevel3Data,
              topGroupingField: isDefaultGroupBy
                ? defaultSubgroupBy
                : defaultSubgroupByFallback,
              midGroupingField: isDefaultGroupBy
                ? defaultSubgroupByFallback
                : defaultSubgroupBy,
              lastGroupingField: POSITION_INSTRUMENT_NAME,
            })
          : formatDataToNestedTableData({
              sortOrder,
              topLevelEntries: topLevelData,
              nestedEntries: winnersAndLosersLevel2Data,
              primaryGroupingField: isDefaultGroupBy
                ? defaultSubgroupBy
                : defaultSubgroupByFallback,
              secondaryGroupingField: isDefaultGroupBy
                ? defaultSubgroupByFallback
                : defaultSubgroupBy,
            });
      }

      return metricFlags.explode_composites
        ? flattenFourLevelHierarchy({
            sortOrder,
            top: topLevelData,
            second: winnersAndLosersLevel2Data,
            third: winnersAndLosersLevel3Data,
            fourth: winnersAndLosersLevel4Data,
            topGroupingField: selection.groupBy,
            secondGroupingField: defaultSubgroupBy,
            thirdGroupingField: defaultSubgroupByFallback,
            fourthGroupingField: POSITION_INSTRUMENT_NAME,
          })
        : flattenThreeLevelHierarchy({
            sortOrder,
            top: topLevelData,
            mid: winnersAndLosersLevel2Data,
            last: winnersAndLosersLevel3Data,
            topGroupingField: selection.groupBy,
            midGroupingField: defaultSubgroupBy,
            lastGroupingField: defaultSubgroupByFallback,
          });
    },
    [
      defaultSubgroupBy,
      defaultSubgroupByFallback,
      metricFlags.explode_composites,
      selection.groupBy,
      winnersAndLosersLevel2Data,
      winnersAndLosersLevel3Data,
      winnersAndLosersLevel4Data,
    ]
  );

  const winersRows = useMemo(() => {
    return buildHierarchicalRows("desc", sortedWinnersTopLevelData);
  }, [buildHierarchicalRows, sortedWinnersTopLevelData]);

  const losersRows = useMemo(() => {
    return buildHierarchicalRows("asc", sortedLosersTopLevelData);
  }, [buildHierarchicalRows, sortedLosersTopLevelData]);

  const isLoading = useMemo(() => {
    return isLoadingCatalog || isLoadingWinnersAndLosers;
  }, [isLoadingCatalog, isLoadingWinnersAndLosers]);

  return {
    winersRows,
    losersRows,
    isLoadingCatalog,
    isLoading,
    metricsCatalogUnfiltered,
    filterOptions,
    isLoadingWinnersAndLosersInvalidate,
    invalidateCache,
    refetchWinnersAndLosers,
  };
};
