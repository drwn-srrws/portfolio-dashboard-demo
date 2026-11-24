import { useMemo } from "react";

import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { useGetPortfolioMetricsV3 } from "@/hooks/api/useGetPortfolioMetric";
import { Filters } from "@/typings/Filters";
import { omitBy } from "@/utils/omit";
import {
  flattenFourLevelHierarchy,
  flattenThreeLevelHierarchy,
} from "@/utils/table";

import {
  createMetricRequest,
  getLosersList,
  getWinnersList,
} from "../components/WinnersAndLosersTable/WinnersAndLosersAnalystsTable.utils";
import { MetricMetadata } from "@/api/types";
import { getFilterOptions } from "@/components/FilterController/utils";
import { MetricFlags } from "@/typings/MetricFlags";

const AVATAR_FIELDS = {
  primary_analyst: "primary_analyst_avatar",
  secondary_analyst: "secondary_analyst_avatar",
} as const;

const INSTRUMENT_GROUP = "company_security_code_portfolio_asset_class";
const INSTRUMENT_NAME = "instrument_security_code";
const POSITION_INSTRUMENT_NAME = "position_instrument_security_code";

export interface UseWinnersAndLosersAnalystsOptions {
  selection: {
    top: string;
  };
  startDate?: string;
  endDate?: string;
  metricFlags: MetricFlags;
  filters: Filters;
  sortByMetric: string;
  metrics?: string[];
  analystType?: "primary_analyst" | "secondary_analyst";
}

export const useWinnersAndLosersAnalysts = ({
  selection,
  startDate,
  endDate,
  metricFlags,
  filters,
  sortByMetric,
  metrics,
  analystType = "primary_analyst",
}: UseWinnersAndLosersAnalystsOptions) => {
  const analystAvatarField = AVATAR_FIELDS[analystType];
  const unusedAvatarField =
    AVATAR_FIELDS[
      analystType === "primary_analyst"
        ? "secondary_analyst"
        : "primary_analyst"
    ];

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
    const filteredMetrics = metricsCatalogUnfiltered.filter(
      (metric) =>
        (metrics?.includes(metric.name) || metric.name === sortByMetric) &&
        metric.name !== unusedAvatarField &&
        metric.name !== analystAvatarField
    );

    const avatarMetric = metricsCatalogUnfiltered.find(
      (metric) => metric.name === analystAvatarField
    );

    return avatarMetric ? [avatarMetric, ...filteredMetrics] : filteredMetrics;
  }, [
    metricsCatalogUnfiltered,
    metrics,
    sortByMetric,
    analystAvatarField,
    unusedAvatarField,
  ]);

  const groupingStrategies = useMemo(
    () => [
      [analystType],
      [analystType, INSTRUMENT_GROUP],
      [analystType, INSTRUMENT_GROUP, INSTRUMENT_NAME],
      ...(metricFlags.explode_composites
        ? [
            [
              analystType,
              INSTRUMENT_GROUP,
              INSTRUMENT_NAME,
              POSITION_INSTRUMENT_NAME,
            ],
          ]
        : []),
    ],
    [metricFlags.explode_composites, analystType]
  );

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

  const winnersAndLosersAnalystsLevel1Data = useMemo(
    () => winnersAndLosers?.[0]?.data || [],
    [winnersAndLosers]
  );

  const winnersAndLosersAnalystsLevel2Data = useMemo(
    () => winnersAndLosers?.[1]?.data || [],
    [winnersAndLosers]
  );

  const winnersAndLosersAnalystsLevel3Data = useMemo(
    () => winnersAndLosers?.[2]?.data || [],
    [winnersAndLosers]
  );

  const winnersAndLosersAnalystsLevel4Data = useMemo(
    () => winnersAndLosers?.[3]?.data || [],
    [winnersAndLosers]
  );

  const sortedWinnersAnalystsTopLevelData = useMemo(() => {
    return getWinnersList(
      winnersAndLosersAnalystsLevel1Data,
      selection.top === "all" ? "all" : Number(selection.top),
      sortByMetric
    );
  }, [winnersAndLosersAnalystsLevel1Data, selection.top, sortByMetric]);

  const sortedLosersAnalystsTopLevelData = useMemo(() => {
    return getLosersList(
      winnersAndLosersAnalystsLevel1Data,
      selection.top === "all" ? "all" : Number(selection.top),
      sortByMetric
    );
  }, [winnersAndLosersAnalystsLevel1Data, selection.top, sortByMetric]);

  const winnersRowsAnalysts = useMemo(() => {
    if (!metricFlags.explode_composites) {
      return flattenThreeLevelHierarchy({
        sortOrder: "desc",
        top: sortedWinnersAnalystsTopLevelData,
        mid: winnersAndLosersAnalystsLevel2Data,
        last: winnersAndLosersAnalystsLevel3Data,
        topGroupingField: analystType,
        midGroupingField: INSTRUMENT_GROUP,
        lastGroupingField: INSTRUMENT_NAME,
      });
    }

    return flattenFourLevelHierarchy({
      sortOrder: "desc",
      top: sortedWinnersAnalystsTopLevelData,
      second: winnersAndLosersAnalystsLevel2Data,
      third: winnersAndLosersAnalystsLevel3Data,
      fourth: winnersAndLosersAnalystsLevel4Data,
      topGroupingField: analystType,
      secondGroupingField: INSTRUMENT_GROUP,
      thirdGroupingField: INSTRUMENT_NAME,
      fourthGroupingField: POSITION_INSTRUMENT_NAME,
    });
  }, [
    metricFlags.explode_composites,
    sortedWinnersAnalystsTopLevelData,
    winnersAndLosersAnalystsLevel2Data,
    winnersAndLosersAnalystsLevel3Data,
    winnersAndLosersAnalystsLevel4Data,
    analystType,
  ]);

  const losersRowsAnalysts = useMemo(() => {
    if (!metricFlags.explode_composites) {
      return flattenThreeLevelHierarchy({
        sortOrder: "asc",
        top: sortedLosersAnalystsTopLevelData,
        mid: winnersAndLosersAnalystsLevel2Data,
        last: winnersAndLosersAnalystsLevel3Data,
        topGroupingField: analystType,
        midGroupingField: INSTRUMENT_GROUP,
        lastGroupingField: INSTRUMENT_NAME,
      });
    }

    return flattenFourLevelHierarchy({
      sortOrder: "asc",
      top: sortedLosersAnalystsTopLevelData,
      second: winnersAndLosersAnalystsLevel2Data,
      third: winnersAndLosersAnalystsLevel3Data,
      fourth: winnersAndLosersAnalystsLevel4Data,
      topGroupingField: analystType,
      secondGroupingField: INSTRUMENT_GROUP,
      thirdGroupingField: INSTRUMENT_NAME,
      fourthGroupingField: POSITION_INSTRUMENT_NAME,
    });
  }, [
    metricFlags.explode_composites,
    sortedLosersAnalystsTopLevelData,
    winnersAndLosersAnalystsLevel2Data,
    winnersAndLosersAnalystsLevel3Data,
    winnersAndLosersAnalystsLevel4Data,
    analystType,
  ]);

  const isLoading = useMemo(() => {
    return isLoadingCatalog || isLoadingWinnersAndLosers;
  }, [isLoadingCatalog, isLoadingWinnersAndLosers]);

  return {
    winnersRowsAnalysts,
    losersRowsAnalysts,
    isLoadingCatalog,
    isLoading,
    metricsCatalogUnfiltered,
    filterOptions,
    isLoadingWinnersAndLosersInvalidate,
    refetchWinnersAndLosers,
    invalidateCache,
  };
};
