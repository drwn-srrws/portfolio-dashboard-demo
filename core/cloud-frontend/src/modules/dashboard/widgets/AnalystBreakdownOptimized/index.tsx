import { GridApi } from "@ag-grid-community/core";
import { useCallback, useMemo, useRef } from "react";

import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { useGetPortfolioMetricsCatalog } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import { MetricMetadata } from "@api/types/index";
import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { DataGrid, DataGridLayout } from "@components/Datagrid/Datagrid";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import FilterController from "@/components/FilterController/FilterController";
import { Filters } from "@/typings/Filters";

import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import { getFilterOptions } from "@/components/FilterController/utils";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { usePanelDateRange } from "@/hooks/usePanelDateRange";
import { exportDatagridToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";
import { useOptimizedDateRange } from "@/providers/OptimizedDateRangeProvider";
import type { DateRangeRequest } from "@/api/aliases";
import { compactDateRangeRequest } from "@/utils/dateRange";

import {
  createAnalystBreakdownOptimizedColumns,
  autoSizeStrategy,
  defaultDataGridProps,
  buildRows,
  AnalystBreakdownRow,
} from "./utils";
import { useAnalystBreakdownConfig, useAnalystBreakdownData } from "./hooks";

const getRowId = (data: AnalystBreakdownRow) => data.id;

export interface AnalystBreakdownOptimizedProps {
  defaultFilters?: Filters;
}

const AnalystBreakdownOptimizedContent = ({
  defaultFilters,
}: AnalystBreakdownOptimizedProps) => {
  const gridRef = useRef<GridApi | null>(null);

  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags } = useMetricFlags();
  const { isMaximized } = usePanelMaximize();

  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();
  const { requestDateRange } = useOptimizedDateRange();

  const { config, isLoading: isLoadingConfig } = useAnalystBreakdownConfig();

  const { data: v3CatalogData, isLoading: isLoadingV3Catalog } =
    useGetPortfolioMetricCatalogV3({
      ...metricFlags,
      include_filterable_values: true,
    });

  const { data: pmCatalogData, isLoading: isLoadingPmCatalog } =
    useGetPortfolioMetricsCatalog();

  const metricsCatalog = useMemo(
    () => pmCatalogData?.metrics || [],
    [pmCatalogData]
  );

  const filterOptions = useMemo(
    () =>
      getFilterOptions(
        v3CatalogData as MetricMetadata,
        config.supportedFilters
      ),
    [v3CatalogData, config.supportedFilters]
  );

  const effectiveDateRange: DateRangeRequest = useMemo(() => {
    if (panelStartDate || panelEndDate) {
      return compactDateRangeRequest({
        start_date: panelStartDate,
        end_date: panelEndDate,
      });
    }
    return compactDateRangeRequest(requestDateRange);
  }, [panelEndDate, panelStartDate, requestDateRange]);

  const isDataEnabled =
    !!v3CatalogData &&
    (!!effectiveDateRange.period ||
      (!!effectiveDateRange.start_date && !!effectiveDateRange.end_date));

  const {
    response,
    displayColumns,
    isLoading: isLoadingData,
    refetch,
  } = useAnalystBreakdownData({
    dateRange: effectiveDateRange,
    sharedFilters: sharedFilters as Record<string, string[]>,
    enabled: isDataEnabled,
    params: { ...metricFlags },
  });

  const rows = useMemo(() => buildRows(response?.data ?? []), [response]);

  const columns = useMemo(
    () =>
      createAnalystBreakdownOptimizedColumns(metricsCatalog, displayColumns),
    [metricsCatalog, displayColumns]
  );

  const isGlobalLoading =
    isLoadingV3Catalog || isLoadingPmCatalog || isLoadingConfig;
  const isLoading = isLoadingData || isGlobalLoading;

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({ mode: isMaximized ? "normal" : "responsive" }),
    [isMaximized]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <WidgetWrapper data-testid="analyst-breakdown-optimized-widget">
      <WidgetHeader>
        <WidgetTitle
          {...{
            exportToCSV: (name) => exportDatagridToCSV(gridRef, name),
          }}
        >
          Analyst Breakdown
        </WidgetTitle>
        <WidgetActions>
          <WidgetRefetchButton
            onRefetch={handleRefetch}
            isRefreshing={isLoadingData}
          />
          <WidgetMaximizeButton id="analyst-breakdown-optimized-maximize-button" />
        </WidgetActions>
      </WidgetHeader>

      <FilterController
        id="analyst-breakdown-optimized-filter-controller"
        filterOptions={filterOptions}
        selectedFilters={filters}
        setSelectedFilters={setFilters}
        isLoadingMetricsCatalog={isGlobalLoading}
        testId="analyst-breakdown-optimized-filter-controller"
        defaultFilters={defaultFilters}
        disableSubFilterPortal
      />

      <WidgetBody data-testid="analyst-breakdown-optimized-table-body">
        <div className="border-top-no-radius winners-losers-table-ag-grid flex size-full flex-col">
          <DataGrid
            gridRef={gridRef}
            layout={dataGridLayout}
            rowData={rows}
            columnDefs={columns}
            loading={isLoading}
            autoSizeStrategy={autoSizeStrategy}
            getRowId={getRowId}
            rowSelection="multiple"
            tooltipShowDelay={0}
            tooltipHideDelay={600000}
            {...defaultDataGridProps}
          />
        </div>
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const AnalystBreakdownOptimized = withAppInsights(
  AnalystBreakdownOptimizedContent,
  "AnalystBreakdownOptimized"
);
