import { useCallback, useMemo } from "react";

import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import FilterController from "@components/FilterController/FilterController";
import { NoDataOverlay } from "@components/Overlay/NoDataOverlay";
import { TextSelect } from "@/components/TextSelect";
import { SkeletonWrapper } from "@components/SkeletonWrapper/SkeletonWrapper";
import { Skeleton } from "@components/ui/skeleton";
import { createMetricOptions } from "@/utils/metricOptions";
import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import { getFilterOptions } from "@/components/FilterController/utils";
import { MetricMetadata } from "@api/types";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { usePanelDateRange } from "@/hooks/usePanelDateRange";
import { Filters } from "@/typings/Filters";
import {
  exportTimeSeriesToCSV,
  TimeSeries,
} from "@/components/MultiChart/utils";
import { MetricChart } from "@components/MetricChart";
import { cn } from "@/utils";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import { useIsMobile } from "@/hooks/useMobile";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useOptimizedDateRange } from "@/providers/OptimizedDateRangeProvider";
import type { DateRangeRequest } from "@/api/aliases";
import { compactDateRangeRequest } from "@/utils/dateRange";

import { transformToChartData, isAlphaMetric } from "./utils";

import {
  usePerformanceOverviewConfig,
  usePerformanceOverviewState,
  usePerformanceOverviewData,
  useFormattedPerformanceOverviewData,
} from "./hooks";

const DEFAULT_DISPLAY_METRIC = "cumulative_pnl_percent_nav";

export interface PerformanceOverviewOptimizedProps {
  defaultFilters?: Filters;
  showFilters?: boolean;
  defaultBenchmarkId?: string;
}

const PerformanceOverviewOptimizedContent = ({
  defaultFilters,
  showFilters = true,
  defaultBenchmarkId,
}: PerformanceOverviewOptimizedProps) => {
  const isMobile = useIsMobile();
  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags } = useMetricFlags();
  const { isMaximized } = usePanelMaximize();

  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();
  const { requestDateRange } = useOptimizedDateRange();
  const effectiveDateRange: DateRangeRequest = useMemo(() => {
    if (panelStartDate || panelEndDate) {
      return compactDateRangeRequest({
        start_date: panelStartDate,
        end_date: panelEndDate,
      });
    }
    return compactDateRangeRequest(requestDateRange);
  }, [panelEndDate, panelStartDate, requestDateRange]);

  const { config, isLoading: isLoadingConfig } = usePerformanceOverviewConfig();

  const { data: metricsCatalogData, isLoading: isLoadingCatalog } =
    useGetPortfolioMetricCatalogV3({
      ...metricFlags,
      include_filterable_values: true,
    });

  const metricsCatalog = useMemo(
    () => metricsCatalogData?.metrics || [],
    [metricsCatalogData]
  );

  const {
    selectedGroupBy,
    handleGroupByChange,
    selectedDisplayValue,
    handleDisplayValueChange,
    selectedBenchmarkId,
    handleBenchmarkChange,
  } = usePerformanceOverviewState({
    config,
    defaultDisplayMetric: DEFAULT_DISPLAY_METRIC,
    defaultBenchmarkId: defaultBenchmarkId ?? config.defaultBenchmarkId,
  });

  const combinedFilters = useMemo(() => {
    return {
      ...defaultFilters,
      ...sharedFilters,
      ...filters,
    };
  }, [defaultFilters, sharedFilters, filters]);

  const filterOptions = useMemo(() => {
    return getFilterOptions(
      metricsCatalogData as MetricMetadata,
      config.supportedFilters
    );
  }, [metricsCatalogData, config.supportedFilters]);

  const groupByOptions = useMemo(() => {
    return createMetricOptions(config.selectableDimensions, metricsCatalog);
  }, [config.selectableDimensions, metricsCatalog]);

  const benchmarkOptions = useMemo(() => {
    return Object.entries(config.benchmarks).map(([id, name]) => ({
      label: name,
      value: id,
    }));
  }, [config.benchmarks]);

  const showBenchmarkSelector = isAlphaMetric(selectedDisplayValue);

  const isDataEnabled =
    !!metricsCatalogData && !!config.selectableDimensions.length;

  const {
    data,
    metadata,
    isLoading: isLoadingData,
    isLoadingInvalidate,
    refetch,
  } = usePerformanceOverviewData({
    dateRange: effectiveDateRange,
    selectedGroupBy,
    combinedFilters: combinedFilters as Record<string, string[]>,
    enabled: isDataEnabled,
    displayMetric: selectedDisplayValue,
    benchmarkId: selectedBenchmarkId,
  });

  const displayOptions = useMemo(() => {
    const dimensions = metadata?.selectable_display_dimensions ?? [
      DEFAULT_DISPLAY_METRIC,
    ];
    return dimensions.map((metric) => ({
      label:
        metricsCatalog.find((m) => m.name === metric)?.display_name || metric,
      value: metric,
    }));
  }, [metadata?.selectable_display_dimensions, metricsCatalog]);

  const { chartData } = useFormattedPerformanceOverviewData({
    data,
    metadata,
    metricsCatalog,
    selectedGroupBy,
    selectedDisplayValue,
    transformToChartData,
  });

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const isGlobalLoading = isLoadingCatalog || isLoadingConfig;
  const isLoading = isLoadingData || isGlobalLoading;

  const exportToCSV = useCallback(
    (name: string) => {
      exportTimeSeriesToCSV(name, chartData as TimeSeries[]);
    },
    [chartData]
  );

  const Actions = () => (
    <div className="flex gap-3 justify-end">
      {showBenchmarkSelector && (
        <SkeletonWrapper
          isLoading={isGlobalLoading}
          skeletonClassName="w-[160px] h-9"
        >
          <TextSelect
            id="performance-overview-optimized-benchmark-select"
            disablePortal
            virtual
            options={benchmarkOptions}
            value={selectedBenchmarkId}
            placeholder="Select Benchmark"
            onChange={handleBenchmarkChange}
            testId="performance-overview-optimized-benchmark-select"
          />
        </SkeletonWrapper>
      )}
      <SkeletonWrapper
        isLoading={isGlobalLoading}
        skeletonClassName="w-[128px] h-9"
      >
        <TextSelect
          id="performance-overview-optimized-group-by-select"
          disablePortal
          virtual
          options={groupByOptions}
          value={selectedGroupBy}
          placeholder="Aggregate By"
          onChange={handleGroupByChange}
          testId="performance-overview-optimized-group-by-select"
        />
      </SkeletonWrapper>
      <SkeletonWrapper
        isLoading={isGlobalLoading}
        skeletonClassName="w-[128px] h-9"
      >
        <TextSelect
          id="performance-overview-optimized-metrics-select"
          disablePortal
          virtual
          options={displayOptions}
          value={selectedDisplayValue}
          placeholder="Display Value"
          onChange={handleDisplayValueChange}
          testId="performance-overview-optimized-metrics-select"
        />
      </SkeletonWrapper>
    </div>
  );

  return (
    <WidgetWrapper testId="performance-overview-optimized-widget">
      <WidgetHeader>
        <WidgetTitle {...{ exportToCSV }}>Performance Overview</WidgetTitle>
        <WidgetActions>
          <WidgetRefetchButton
            onRefetch={handleRefetch}
            isRefreshing={isLoadingData || isLoadingInvalidate}
          />
          {!isMobile && <Actions />}
          <WidgetMaximizeButton id="performance-overview-optimized-maximize-button" />
        </WidgetActions>
      </WidgetHeader>
      {isMobile && <Actions />}

      <FilterController
        filterOptions={filterOptions}
        selectedFilters={filters}
        defaultFilters={defaultFilters}
        isLoadingMetricsCatalog={isGlobalLoading}
        testId="performance-overview-optimized-filter-controller"
        setSelectedFilters={setFilters}
        disableSubFilterPortal
        showFilters={showFilters}
      />

      <WidgetBody data-testid="performance-overview-optimized-table-body">
        <div className={cn("h-96 md:h-full", isMaximized && "h-full")}>
          {isLoading ? (
            <Skeleton className="size-full" />
          ) : !chartData.length ? (
            <NoDataOverlay />
          ) : (
            <MetricChart data={chartData} />
          )}
        </div>
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const PerformanceOverviewOptimized = withAppInsights(
  PerformanceOverviewOptimizedContent,
  "PerformanceOverviewOptimized"
);
