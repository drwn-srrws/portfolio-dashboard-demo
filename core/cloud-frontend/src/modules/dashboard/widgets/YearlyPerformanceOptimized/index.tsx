import { useCallback, useMemo, useRef } from "react";
import { GridApi } from "@ag-grid-community/core";

import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { MetricMetadata } from "@api/types/index";
import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { DataGrid, DataGridLayout } from "@components/Datagrid/Datagrid";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import FilterController from "@/components/FilterController/FilterController";
import { Filters } from "@/typings/Filters";
import { MetricDisplayType } from "@/api/types";

import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import { getFilterOptions } from "@/components/FilterController/utils";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { exportDatagridToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";
import { hyphenatedDate } from "@/utils/dates";
import type { DateRangeRequest } from "@/api/aliases";
import { compactDateRangeRequest } from "@/utils/dateRange";

import { useYearlyPerformanceConfig, useYearlyPerformanceData } from "./hooks";
import {
  createYearlyPerformanceOptimizedColumns,
  autoSizeStrategy,
  defaultGridProps,
} from "./utils";

const LTD_START_YEAR = 2021;

const getDefaultDateRange = () => {
  const now = new Date();
  const startDate = `${LTD_START_YEAR}-01-01`;
  const endDate = hyphenatedDate(now);
  return { startDate, endDate };
};

export interface YearlyPerformanceOptimizedProps {
  defaultFilters?: Filters;
}

const YearlyPerformanceOptimizedContent = ({
  defaultFilters,
}: YearlyPerformanceOptimizedProps) => {
  const gridRef = useRef<GridApi | null>(null);

  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags } = useMetricFlags();
  const { isMaximized } = usePanelMaximize();

  const { config, isLoading: isLoadingConfig } = useYearlyPerformanceConfig();

  const { data: metricsCatalogData, isLoading: isLoadingCatalog } =
    useGetPortfolioMetricCatalogV3({
      ...metricFlags,
      include_filterable_values: true,
    });

  const filterOptions = useMemo(
    () =>
      getFilterOptions(
        metricsCatalogData as MetricMetadata,
        config.supportedFilters
      ),
    [metricsCatalogData, config.supportedFilters]
  );

  const combinedFilters = useMemo(
    () => ({ ...defaultFilters, ...sharedFilters }),
    [defaultFilters, sharedFilters]
  );

  const { startDate, endDate } = useMemo(() => {
    const defaults = getDefaultDateRange();
    return {
      startDate: config.dateRange?.start_date ?? defaults.startDate,
      endDate: config.dateRange?.end_date ?? defaults.endDate,
    };
  }, [config.dateRange]);

  const effectiveDateRange: DateRangeRequest = useMemo(
    () => compactDateRangeRequest({ start_date: startDate, end_date: endDate }),
    [endDate, startDate]
  );

  const {
    response,
    isLoading: isLoadingData,
    isLoadingInvalidate,
    refetch,
  } = useYearlyPerformanceData({
    dateRange: effectiveDateRange,
    sharedFilters: combinedFilters as Record<string, string[]>,
    enabled: !!metricsCatalogData,
  });

  const displayColumns = useMemo(
    () => response?.metadata?.display_columns ?? [],
    [response]
  );

  const groupByColumns = useMemo(
    () => response?.metadata?.group_by ?? [],
    [response]
  );

  const rows = useMemo(() => response?.data ?? [], [response]);

  const columns = useMemo(
    () =>
      createYearlyPerformanceOptimizedColumns(
        displayColumns,
        groupByColumns,
        MetricDisplayType.percent
      ),
    [displayColumns, groupByColumns]
  );

  const getRowId = useCallback(
    (row: Record<string, unknown>) => {
      for (const col of groupByColumns) {
        const val = row[col];
        if (val != null) return String(val);
      }
      return "total";
    },
    [groupByColumns]
  );

  const isGlobalLoading = isLoadingCatalog || isLoadingConfig;
  const isLoading = isLoadingData || isGlobalLoading;

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({ mode: isMaximized ? "normal" : "responsive" }),
    [isMaximized]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <WidgetWrapper testId="yearly-performance-optimized-widget">
      <WidgetHeader>
        <WidgetTitle
          {...{
            exportToCSV: (name) => exportDatagridToCSV(gridRef, name),
          }}
        >
          Yearly Performance
        </WidgetTitle>
        <WidgetActions>
          <WidgetRefetchButton
            onRefetch={handleRefetch}
            isRefreshing={isLoadingData || isLoadingInvalidate}
          />
          <WidgetMaximizeButton id="yearly-performance-optimized-maximize-button" />
        </WidgetActions>
      </WidgetHeader>

      <FilterController
        id="yearly-performance-optimized-filter-controller"
        filterOptions={filterOptions}
        selectedFilters={filters}
        setSelectedFilters={setFilters}
        isLoadingMetricsCatalog={isGlobalLoading}
        testId="yearly-performance-optimized-filter-controller"
        defaultFilters={defaultFilters}
        disableSubFilterPortal
      />

      <WidgetBody data-testid="yearly-performance-optimized-table-body">
        <div className="border-top-no-radius winners-losers-table-ag-grid flex size-full flex-col">
          <DataGrid
            gridRef={gridRef}
            layout={dataGridLayout}
            rowData={rows}
            columnDefs={columns}
            loading={isLoading}
            autoSizeStrategy={autoSizeStrategy}
            getRowId={getRowId}
            tooltipShowDelay={0}
            tooltipHideDelay={600000}
            {...defaultGridProps}
          />
        </div>
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const YearlyPerformanceOptimized = withAppInsights(
  YearlyPerformanceOptimizedContent,
  "YearlyPerformanceOptimized"
);
