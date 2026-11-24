import { useCallback, useMemo, useState } from "react";

import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { useGetPortfolioMetricsV3 } from "@/hooks/api/useGetPortfolioMetric";
import { MetricRequest, MetricMetadata } from "@api/types/index";
import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import FilterController from "@/components/FilterController/FilterController";
import { NoDataOverlay } from "@components/Overlay/NoDataOverlay";
import { TextSelect } from "@/components/TextSelect";
import { Treemap } from "@components/Treemap/Treemap";
import { Skeleton } from "@components/ui/skeleton";
import { createMetricOptions } from "@/utils/metricOptions";
import { omitBy } from "@/utils/omit";
import { capitalize } from "@/utils/strings";
import { formatAndProcessTreemapData } from "@/utils/treemap";
import { usePanel } from "@/providers/PanelProvider";

import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import { getFilterOptions } from "@/components/FilterController/utils";
import { Filters } from "@/typings/Filters";
import { usePanelDateRange } from "@/hooks/usePanelDateRange";
import { useDateRange } from "@/providers/DateRangeProvider";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { exportGroupedTreemapToCSV } from "@/components/Treemap/utils";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import { cn } from "@/utils";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";

export interface PerformanceDistributionProps {
  groupByMetrics: string[];
  defaultGroupByMetric: string;
  defaultDisplayMetric: string;
  defaultSubgroupBy: string;
  defaultSizeMetric: string;
  defaultFilters?: Filters;
}

const PerformanceDistributionContent = ({
  groupByMetrics,
  defaultGroupByMetric,
  defaultDisplayMetric,
  defaultSubgroupBy,
  defaultSizeMetric,
  defaultFilters,
}: PerformanceDistributionProps) => {
  const dockViewPanelProps = usePanel();
  const { isMaximized } = usePanelMaximize();

  const [selectedGroupBy, setSelectedGroupBy] =
    useState<string>(defaultGroupByMetric);

  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();
  const { startDate, endDate } = useDateRange();

  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags } = useMetricFlags();

  const { data: metricsCatalogData, isLoading: isLoadingCatalog } =
    useGetPortfolioMetricCatalogV3({
      ...metricFlags,
      include_filterable_values: true,
    });

  const filterOptions = useMemo(() => {
    return getFilterOptions(metricsCatalogData as MetricMetadata);
  }, [metricsCatalogData]);

  const metricsCatalog = useMemo(() => {
    return metricsCatalogData?.metrics || [];
  }, [metricsCatalogData]);

  const groupByOptions = useMemo(
    () => createMetricOptions(groupByMetrics, metricsCatalog),
    [groupByMetrics, metricsCatalog]
  );

  const metrics = useMemo(() => {
    return metricsCatalog.filter(
      (metric) =>
        metric.name === defaultDisplayMetric ||
        metric.name === defaultSizeMetric
    );
  }, [metricsCatalog, defaultDisplayMetric, defaultSizeMetric]);

  const metricsPayload: MetricRequest = useMemo(
    () => ({
      start_date: panelStartDate ?? startDate,
      end_date: panelEndDate ?? endDate,
      metrics: metrics.map((option) => ({ name: option.name })),
      group_by: [defaultSubgroupBy, selectedGroupBy],
      filters: omitBy(sharedFilters, (item) => !item.length),
      sort_by: {
        sort_by: [selectedGroupBy],
        sort_descending: false,
      },
    }),
    [
      panelStartDate,
      panelEndDate,
      startDate,
      endDate,
      metrics,
      selectedGroupBy,
      defaultSubgroupBy,
      sharedFilters,
    ]
  );

  const {
    isLoading: isLoadingPerformanceDistributionInvalidate,
    refetch: invalidateCache,
  } = useGetPortfolioMetricsV3(
    [metricsPayload],
    { ...metricFlags, invalidate_cache: true },
    {
      query: { enabled: false },
    }
  );

  const {
    data: performanceDistributionData,
    isLoading: isLoadingPerformanceDistribution,
    refetch: refetchPerformanceDistribution,
  } = useGetPortfolioMetricsV3([metricsPayload], metricFlags, {
    query: {
      enabled: !!metricsCatalogData,
    },
  });

  const formatedPerformanceDistributionData = useMemo(
    () =>
      formatAndProcessTreemapData({
        data: performanceDistributionData?.[0]?.data || [],
        groupByMetric: selectedGroupBy,
        colorMetric: defaultDisplayMetric,
        sizeMetric: defaultSizeMetric,
        leafMetric: defaultSubgroupBy,
        metrics,
      }),
    [
      performanceDistributionData,
      selectedGroupBy,
      defaultDisplayMetric,
      defaultSizeMetric,
      defaultSubgroupBy,
      metrics,
    ]
  );

  const exportToCSV = useCallback(
    (name: string) => {
      exportGroupedTreemapToCSV(name, formatedPerformanceDistributionData);
    },
    [formatedPerformanceDistributionData]
  );

  const handleRefetch = useCallback(async () => {
    await invalidateCache();
    await refetchPerformanceDistribution();
  }, [invalidateCache, refetchPerformanceDistribution]);

  return (
    <WidgetWrapper testId="performance-distribution-widget">
      {isLoadingCatalog ? (
        <div className="flex size-full flex-1 flex-col justify-center gap-5 ">
          <Skeleton className="w-[full] flex-1" />
        </div>
      ) : (
        <>
          <WidgetHeader>
            <WidgetTitle {...{ exportToCSV }}>
              WTD Performance Distribution
            </WidgetTitle>
            <WidgetActions>
              <WidgetRefetchButton
                onRefetch={handleRefetch}
                isRefreshing={
                  isLoadingPerformanceDistributionInvalidate || isLoadingCatalog
                }
              />
              <TextSelect
                disablePortal
                virtual
                options={groupByOptions}
                value={selectedGroupBy}
                placeholder="Aggregate By"
                onChange={(value) => setSelectedGroupBy(`${value}`)}
                testId="performance-distribution-group-by-select"
              />
              <WidgetMaximizeButton />
            </WidgetActions>
          </WidgetHeader>

          <FilterController
            filterOptions={filterOptions}
            selectedFilters={filters}
            defaultFilters={defaultFilters}
            setSelectedFilters={setFilters}
            isLoadingMetricsCatalog={isLoadingCatalog}
            disableSubFilterPortal
            testId="performance-distribution-filter-controller"
          />

          <WidgetBody data-testid="performance-distribution-body">
            {isLoadingPerformanceDistribution ||
            formatedPerformanceDistributionData.length ? (
              <div
                className={cn(
                  "flex w-full h-96 md:h-full flex-nowrap gap-y-2 overflow-hidden",
                  isMaximized && "h-full"
                )}
                style={{ columnGap: "6px" }}
              >
                {isLoadingPerformanceDistribution ? (
                  <div className="flex size-full flex-1 flex-col justify-center gap-5 ">
                    <Skeleton className="w-[full] flex-1" />
                  </div>
                ) : (
                  formatedPerformanceDistributionData.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col w-full  md:max-h-none"
                    >
                      <h2 className="bg-neutral-700 px-3 py-2 text-sm font-medium">
                        {capitalize(item.name)}
                      </h2>
                      <div className="flex-1 bg-neutral-800 p-3">
                        <Treemap
                          data={item.data}
                          panelProps={dockViewPanelProps}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <NoDataOverlay />
            )}
          </WidgetBody>
        </>
      )}
    </WidgetWrapper>
  );
};

export const PerformanceDistribution = withAppInsights(
  PerformanceDistributionContent,
  "PerformanceDistribution"
);
