import { ColDef, GridApi } from "@ag-grid-community/core";
import { useCallback, useMemo, useRef } from "react";

import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
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
  createLiquiditySummaryOptimizedColumns,
  autoSizeStrategy,
  defaultDataGridProps,
  buildNestedRows,
  getMetricNamesFromResponse,
  getGroupingFieldsFromResponse,
} from "./utils";
import { useLiquiditySummaryConfig, useLiquiditySummaryData } from "./hooks";

const getDataPath = (data: { uniqueIds: string[] }) => data.uniqueIds;
const getRowId = (data: { uniqueIds: string[] }) => data.uniqueIds.join("-");

export interface LiquiditySummaryOptimizedProps {
  defaultFilters?: Filters;
}

const LiquiditySummaryOptimizedContent = ({
  defaultFilters,
}: LiquiditySummaryOptimizedProps) => {
  const gridRef = useRef<GridApi | null>(null);

  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags } = useMetricFlags();
  const { isMaximized } = usePanelMaximize();

  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();
  const { requestDateRange } = useOptimizedDateRange();

  const { config, isLoading: isLoadingConfig } = useLiquiditySummaryConfig();

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
    !!metricsCatalogData &&
    (!!effectiveDateRange.period ||
      (!!effectiveDateRange.start_date && !!effectiveDateRange.end_date));

  const {
    responses,
    isLoading: isLoadingData,
    isLoadingInvalidate,
    refetch,
  } = useLiquiditySummaryData({
    dateRange: effectiveDateRange,
    sharedFilters: sharedFilters as Record<string, string[]>,
    enabled: isDataEnabled,
  });

  const rows = useMemo(() => buildNestedRows(responses), [responses]);

  const metricNames = useMemo(
    () => getMetricNamesFromResponse(responses),
    [responses]
  );

  const groupingFields = useMemo(
    () => getGroupingFieldsFromResponse(responses),
    [responses]
  );

  const columns = useMemo(
    () => createLiquiditySummaryOptimizedColumns(metricsCatalog, metricNames),
    [metricsCatalog, metricNames]
  );

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    const headerName =
      metricsCatalog.find((m) => m.name === groupingFields[0])?.display_name ||
      groupingFields[0];

    const headerTooltip =
      metricsCatalog.find((m) => m.name === groupingFields[0])?.description ||
      groupingFields[0];

    return {
      flex: 1,
      minWidth: 70,
      headerName: headerName || "Group",
      headerTooltip: headerTooltip || undefined,
      headerClass: "scalable-table-header",
      resizable: false,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
    };
  }, [metricsCatalog, groupingFields]);

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
    <WidgetWrapper data-testid="liquidity-summary-optimized-widget">
      <WidgetHeader>
        <WidgetTitle
          {...{
            exportToCSV: (name) => exportDatagridToCSV(gridRef, name),
          }}
        >
          Liquidity Summary
        </WidgetTitle>
        <WidgetActions>
          <WidgetRefetchButton
            onRefetch={handleRefetch}
            isRefreshing={isLoadingData || isLoadingInvalidate}
          />
          <WidgetMaximizeButton id="liquidity-summary-optimized-maximize-button" />
        </WidgetActions>
      </WidgetHeader>

      <FilterController
        id="liquidity-summary-optimized-filter-controller"
        filterOptions={filterOptions}
        selectedFilters={filters}
        setSelectedFilters={setFilters}
        isLoadingMetricsCatalog={isGlobalLoading}
        testId="liquidity-summary-optimized-filter-controller"
        defaultFilters={defaultFilters}
        disableSubFilterPortal
      />

      <WidgetBody data-testid="liquidity-summary-optimized-table-body">
        <div className="border-top-no-radius winners-losers-table-ag-grid flex size-full flex-col">
          <DataGrid
            gridRef={gridRef}
            layout={dataGridLayout}
            rowData={rows}
            columnDefs={columns}
            loading={isLoading}
            autoSizeStrategy={autoSizeStrategy}
            autoGroupColumnDef={autoGroupColumnDef}
            getDataPath={getDataPath}
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

export const LiquiditySummaryOptimized = withAppInsights(
  LiquiditySummaryOptimizedContent,
  "LiquiditySummaryOptimized"
);
