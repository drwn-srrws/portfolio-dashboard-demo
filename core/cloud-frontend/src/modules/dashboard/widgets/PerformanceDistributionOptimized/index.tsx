import { useCallback, useMemo } from "react";

import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { MetricMetadata } from "@api/types/index";
import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import FilterController from "@/components/FilterController/FilterController";
import { NoDataOverlay } from "@components/Overlay/NoDataOverlay";
import { TextSelect } from "@/components/TextSelect";
import { Treemap } from "@components/Treemap/Treemap";
import { Skeleton } from "@components/ui/skeleton";
import { capitalize } from "@/utils/strings";
import { usePanel } from "@/providers/PanelProvider";
import { Filters } from "@/typings/Filters";

import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import { getFilterOptions } from "@/components/FilterController/utils";
import { usePanelDateRange } from "@/hooks/usePanelDateRange";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { exportGroupedTreemapToCSV } from "@/components/Treemap/utils";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import { cn } from "@/utils";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";
import { createMetricOptions } from "@/utils/metricOptions";
import { useOptimizedDateRange } from "@/providers/OptimizedDateRangeProvider";
import type { DateRangeRequest } from "@/api/aliases";
import { compactDateRangeRequest } from "@/utils/dateRange";

import {
  useHeatMapConfig,
  useHeatMapState,
  useHeatMapData,
  useFormattedHeatMapData,
} from "./hooks";

export interface PerformanceDistributionOptimizedProps {
  defaultFilters?: Filters;
}

const PerformanceDistributionOptimizedContent = ({
  defaultFilters,
}: PerformanceDistributionOptimizedProps) => {
  const dockViewPanelProps = usePanel();
  const { isMaximized } = usePanelMaximize();
  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();
  const { requestDateRange } = useOptimizedDateRange();
  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags } = useMetricFlags();

  const { config, isLoading: isLoadingConfig } = useHeatMapConfig();

  const { data: metricsCatalogData, isLoading: isLoadingCatalog } =
    useGetPortfolioMetricCatalogV3({
      ...metricFlags,
      include_filterable_values: true,
    });

  const metricsCatalog = useMemo(
    () => metricsCatalogData?.metrics || [],
    [metricsCatalogData]
  );

  const { setSelectedGroupBy, effectiveGroupBy } = useHeatMapState(config);

  const filterOptions = useMemo(
    () =>
      getFilterOptions(
        metricsCatalogData as MetricMetadata,
        config.supportedFilters
      ),
    [metricsCatalogData, config.supportedFilters]
  );

  const groupByOptions = useMemo(
    () => createMetricOptions(config.groupByMetrics, metricsCatalog),
    [config.groupByMetrics, metricsCatalog]
  );

  const effectiveDateRange: DateRangeRequest = useMemo(() => {
    if (config.dateRangePeriod) {
      return compactDateRangeRequest({ period: config.dateRangePeriod });
    }
    if (panelStartDate || panelEndDate) {
      return compactDateRangeRequest({
        start_date: panelStartDate,
        end_date: panelEndDate,
      });
    }
    return compactDateRangeRequest(requestDateRange);
  }, [config.dateRangePeriod, panelEndDate, panelStartDate, requestDateRange]);

  const isDataEnabled =
    !!metricsCatalogData &&
    !!effectiveGroupBy &&
    (!!effectiveDateRange.period ||
      (!!effectiveDateRange.start_date && !!effectiveDateRange.end_date));

  const {
    data: heatMapsData,
    isLoading: isLoadingHeatMaps,
    isLoadingInvalidate,
    refetch,
  } = useHeatMapData({
    dateRange: effectiveDateRange,
    effectiveGroupBy,
    sharedFilters: sharedFilters as Record<string, string[]>,
    config,
    enabled: isDataEnabled,
  });

  const formattedData = useFormattedHeatMapData({
    data: heatMapsData,
    effectiveGroupBy,
    config,
    metricsCatalog,
  });

  const exportToCSV = useCallback(
    (name: string) => {
      exportGroupedTreemapToCSV(name, formattedData);
    },
    [formattedData]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const isGlobalLoading = isLoadingCatalog || isLoadingConfig;
  const hasData = formattedData.length > 0;
  const showDataView = isLoadingHeatMaps || hasData;

  return (
    <WidgetWrapper testId="performance-distribution-optimized-widget">
      {isGlobalLoading ? (
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
                isRefreshing={isLoadingInvalidate || isLoadingHeatMaps}
              />
              <TextSelect
                disablePortal
                virtual
                options={groupByOptions}
                value={effectiveGroupBy}
                placeholder="Aggregate By"
                onChange={(value) => setSelectedGroupBy(`${value}`)}
                testId="performance-distribution-optimized-group-by-select"
              />
              <WidgetMaximizeButton />
            </WidgetActions>
          </WidgetHeader>

          <FilterController
            filterOptions={filterOptions}
            selectedFilters={filters}
            defaultFilters={defaultFilters}
            setSelectedFilters={setFilters}
            isLoadingMetricsCatalog={isGlobalLoading}
            disableSubFilterPortal
            testId="performance-distribution-optimized-filter-controller"
          />

          <WidgetBody data-testid="performance-distribution-optimized-body">
            {showDataView ? (
              <div
                className={cn(
                  "flex w-full h-96 md:h-full flex-nowrap gap-y-2 overflow-hidden",
                  isMaximized && "h-full"
                )}
                style={{ columnGap: "6px" }}
              >
                {isLoadingHeatMaps ? (
                  <div className="flex size-full flex-1 flex-col justify-center gap-5 ">
                    <Skeleton className="w-[full] flex-1" />
                  </div>
                ) : (
                  formattedData.map((item) => (
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

export const PerformanceDistributionOptimized = withAppInsights(
  PerformanceDistributionOptimizedContent,
  "PerformanceDistributionOptimized"
);
