import { useCallback, useMemo, useRef } from "react";

import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";

import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import FilterController from "@/components/FilterController/FilterController";
import { DataGrid, DataGridLayout } from "@components/Datagrid/Datagrid";

import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";

import { getFilterOptions } from "@/components/FilterController/utils";
import { MetricMetadata } from "@/api/types";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { usePanelDateRange } from "@/hooks/usePanelDateRange";
import { GridApi } from "@ag-grid-community/core";
import { exportDatagridToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import { useOptimizedDateRange } from "@/providers/OptimizedDateRangeProvider";
import type { DateRangeRequest } from "@/api/aliases";
import { compactDateRangeRequest } from "@/utils/dateRange";

import {
  transformFundPerformanceResponse,
  createFundPerformanceColumns,
  autoSizeStrategy,
  defaultDataGridProps,
} from "./utils";

import {
  useFundPerformanceConfig,
  useFundPerformanceData,
  useFormattedFundPerformanceData,
  type FundPerformanceRow,
} from "./hooks";

const FundPerformanceTableContent = () => {
  const gridRef = useRef<GridApi | null>(null);
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

  const {
    config,
    metadata,
    isLoading: isLoadingConfig,
  } = useFundPerformanceConfig({
    dateRange: effectiveDateRange,
  });

  const { data: metricsCatalogData, isLoading: isLoadingCatalog } =
    useGetPortfolioMetricCatalogV3({
      ...metricFlags,
      include_filterable_values: true,
    });

  const metricsCatalog = useMemo(
    () => metricsCatalogData?.metrics || [],
    [metricsCatalogData]
  );

  const filterOptions = useMemo(
    () =>
      getFilterOptions(
        metricsCatalogData as MetricMetadata,
        config.supportedFilters
      ),
    [metricsCatalogData, config.supportedFilters]
  );

  const isDataEnabled =
    !!metricsCatalogData &&
    !!metadata &&
    (!!effectiveDateRange.period ||
      (!!effectiveDateRange.start_date && !!effectiveDateRange.end_date));

  const {
    data,
    displayColumns,
    isLoading: isLoadingData,
    isLoadingInvalidate,
    refetch,
  } = useFundPerformanceData({
    dateRange: effectiveDateRange,
    sharedFilters: sharedFilters as Record<string, string[]>,
    enabled: isDataEnabled,
  });

  const { rows, columns } = useFormattedFundPerformanceData({
    data,
    displayColumns,
    metricsCatalog,
    transformToRowsData: transformFundPerformanceResponse,
    createColumnsFunction: createFundPerformanceColumns,
  });

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const isGlobalLoading = isLoadingCatalog || isLoadingConfig;
  const isLoading = isLoadingData || isGlobalLoading;

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({
      mode: isMaximized ? "normal" : "responsive",
    }),
    [isMaximized]
  );

  const getRowId = useCallback((data: FundPerformanceRow) => data.name, []);

  return (
    <WidgetWrapper>
      <WidgetHeader>
        <WidgetTitle
          {...{
            exportToCSV: (name) => exportDatagridToCSV(gridRef, name),
          }}
        >
          Fund Performance
        </WidgetTitle>
        <WidgetActions>
          <WidgetRefetchButton
            onRefetch={handleRefetch}
            isRefreshing={isLoadingData || isLoadingInvalidate}
          />
          <WidgetMaximizeButton id="fund-performance-maximize-button" />
        </WidgetActions>
      </WidgetHeader>

      <FilterController
        id="fund-performance-filter-controller"
        filterOptions={filterOptions}
        selectedFilters={filters}
        setSelectedFilters={setFilters}
        isLoadingMetricsCatalog={isGlobalLoading}
        testId="fund-performance-optimized-filter-controller"
        disableSubFilterPortal
      />

      <WidgetBody data-testid="fund-performance-table-body">
        <div className="border-top-no-radius winners-losers-table-ag-grid flex size-full flex-col">
          <DataGrid
            gridRef={gridRef}
            layout={dataGridLayout}
            rowData={rows}
            columnDefs={columns}
            loading={isLoading}
            autoSizeStrategy={autoSizeStrategy}
            getRowId={getRowId}
            {...defaultDataGridProps}
            tooltipShowDelay={0}
            tooltipHideDelay={600000}
          />
        </div>
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const FundPerformanceTable = withAppInsights(
  FundPerformanceTableContent,
  "FundPerformanceTable"
);
