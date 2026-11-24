import { ColDef, GridApi } from "@ag-grid-community/core";
import { useCallback, useMemo, useRef } from "react";

import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { KgExposureRequestDimension, MetricMetadata } from "@api/types/index";
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
  createKgExposureDistributionOptimizedColumns,
  autoSizeStrategy,
  defaultDataGridProps,
  buildNestedRows,
  getMetricNamesFromResponse,
  getGroupingFieldsFromResponse,
  getDataPath,
  getRowId,
  buildAutoGroupColumnDef,
} from "./utils";
import { useKgExposureConfig, useKgExposureData } from "./hooks";

export interface KgExposureDistributionOptimizedProps {
  dimension: KgExposureRequestDimension;
  title: string;
  testId: string;
  defaultFilters?: Filters;
  groupColumnMinWidth?: number;
}

const KgExposureDistributionOptimizedContent = ({
  dimension,
  title,
  testId,
  defaultFilters,
  groupColumnMinWidth,
}: KgExposureDistributionOptimizedProps) => {
  const gridRef = useRef<GridApi | null>(null);

  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags } = useMetricFlags();
  const { isMaximized } = usePanelMaximize();

  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();
  const { requestDateRange } = useOptimizedDateRange();

  const {
    config,
    isLoading: isLoadingConfig,
    isError: isConfigError,
  } = useKgExposureConfig();

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
    response,
    isLoading: isLoadingData,
    isError: isDataError,
    isLoadingInvalidate,
    refetch,
  } = useKgExposureData({
    dimension,
    dateRange: effectiveDateRange,
    sharedFilters: sharedFilters as Record<string, string[]>,
    enabled: isDataEnabled,
  });

  const rows = useMemo(() => buildNestedRows(response), [response]);

  const metricNames = useMemo(
    () => getMetricNamesFromResponse(response),
    [response]
  );

  const groupingFields = useMemo(
    () => getGroupingFieldsFromResponse(response),
    [response]
  );

  const columns = useMemo(
    () =>
      createKgExposureDistributionOptimizedColumns(metricsCatalog, metricNames),
    [metricsCatalog, metricNames]
  );

  const autoGroupColumnDef = useMemo<ColDef>(
    () =>
      buildAutoGroupColumnDef(
        groupingFields,
        metricsCatalog,
        groupColumnMinWidth
      ),
    [metricsCatalog, groupingFields, groupColumnMinWidth]
  );

  const isGlobalLoading = isLoadingCatalog || isLoadingConfig;
  const isLoading = isLoadingData || isGlobalLoading;
  const hasError = isConfigError || isDataError;

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({ mode: isMaximized ? "normal" : "responsive" }),
    [isMaximized]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <WidgetWrapper data-testid={`${testId}-widget`}>
      <WidgetHeader>
        <WidgetTitle
          {...{
            exportToCSV: (name: string) => exportDatagridToCSV(gridRef, name),
          }}
        >
          {title}
        </WidgetTitle>
        <WidgetActions>
          <WidgetRefetchButton
            onRefetch={handleRefetch}
            isRefreshing={isLoadingData || isLoadingInvalidate}
          />
          <WidgetMaximizeButton id={`${testId}-maximize-button`} />
        </WidgetActions>
      </WidgetHeader>

      <FilterController
        id={`${testId}-filter-controller`}
        filterOptions={filterOptions}
        selectedFilters={filters}
        setSelectedFilters={setFilters}
        isLoadingMetricsCatalog={isGlobalLoading}
        testId={`${testId}-filter-controller`}
        defaultFilters={defaultFilters}
        disableSubFilterPortal
      />

      <WidgetBody data-testid={`${testId}-table-body`}>
        {hasError ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-red-400">Failed to load {title}</p>
          </div>
        ) : (
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
        )}
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const KgExposureDistributionOptimized = withAppInsights(
  KgExposureDistributionOptimizedContent,
  "KgExposureDistributionOptimized"
);
