import { useMemo } from "react";
import { flattenDynamicHierarchy } from "@/utils/table";
import { MetricResult } from "@api/types/index";
import { MetricFlags } from "@/typings/MetricFlags";

export interface UsePortfolioSummaryTableProps {
  search?: string;
  metrics: string[];
  groupBy: string;
  metricFlags: MetricFlags;
  portfolioMetricsData?: MetricResult[];
  defaultSubgroupBy: string;
  defaultSubgroupByFallback: string;
  groupingLevelsConfig: string[];
  explodeCompositeAdditionalMetrics: string[];
}

export const usePortfolioSummaryTable = ({
  search,
  metrics,
  groupBy,
  metricFlags,
  portfolioMetricsData,
  defaultSubgroupBy,
  defaultSubgroupByFallback,
  groupingLevelsConfig,
  explodeCompositeAdditionalMetrics,
}: UsePortfolioSummaryTableProps) => {
  const columnsOrder = useMemo(() => {
    return metrics
      .filter((metric) => metric !== groupBy)
      .filter((metric) =>
        !metricFlags.explode_composites
          ? !explodeCompositeAdditionalMetrics.includes(metric)
          : true
      );
  }, [metrics, groupBy, metricFlags, explodeCompositeAdditionalMetrics]);

  const formatedData = useMemo(() => {
    const portfolioMetrics = portfolioMetricsData || [];

    const filteredTopLevelData =
      portfolioMetrics?.[0]?.data?.filter(
        (item) =>
          !search ||
          (item[groupBy] as string).toLowerCase().includes(search.toLowerCase())
      ) || [];

    const effectiveGroupingLevels =
      groupBy === defaultSubgroupBy
        ? groupingLevelsConfig.filter(
            (level) => level !== defaultSubgroupByFallback
          )
        : groupingLevelsConfig;

    const groupingFields = [
      groupBy,
      groupBy === defaultSubgroupBy
        ? defaultSubgroupByFallback
        : defaultSubgroupBy,
      ...effectiveGroupingLevels,
    ];

    const dataLevels = groupingFields.map((_, index) =>
      index === 0 ? filteredTopLevelData : portfolioMetrics?.[index]?.data || []
    );

    return flattenDynamicHierarchy({
      dataLevels,
      groupingFields,
    });
  }, [
    portfolioMetricsData,
    groupBy,
    defaultSubgroupBy,
    defaultSubgroupByFallback,
    groupingLevelsConfig,
    search,
  ]);

  return { columnsOrder, formatedData };
};
