import { useCallback, useMemo, useRef } from "react";
import { GridApi, SizeColumnsToFitGridStrategy } from "@ag-grid-community/core";
import { DataGrid, DataGridLayout } from "@/components/Datagrid/Datagrid";
import { WidgetWrapper } from "@/components/Widget/WidgetWrapper";
import { WidgetHeader } from "@/components/Widget/WidgetHeader";
import { WidgetTitle } from "@/components/Widget/WidgetTitle";
import { WidgetActions } from "@/components/Widget/WidgetActions";
import WidgetMaximizeButton from "@/components/Widget/WidgetMaximizeButton";
import { WidgetBody } from "@/components/Widget/WidgetBody";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";
import FilterController from "@/components/FilterController/FilterController";
import { getFilterOptions } from "@/components/FilterController/utils";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import { usePanelDateRange } from "@/hooks/usePanelDateRange";
import { useOptimizedDateRange } from "@/providers/OptimizedDateRangeProvider";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { exportDatagridToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import { omitBy } from "@/utils/omit";
import { compactDateRangeRequest } from "@/utils/dateRange";
import { Filters } from "@/typings/Filters";
import type { DateRangeRequest } from "@/api/aliases";

import {
  defaultDataGridProps,
  createMergedAnalystColumns,
} from "./MergedAnalystBreakdownTable.columns";
import { useGetMergedAlphaAnalystBreakdownStatsEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { MergedAnalystMetricsRequest, MetricMetadata } from "@/api/types";
import { useMergedAnalystBreakdownConfig } from "./hooks";

const autoSizeStrategy: SizeColumnsToFitGridStrategy = {
  type: "fitGridWidth",
};

const getRowId = (data: Record<string, unknown>) =>
  String(data.analyst_name ?? "");

export interface MergedAnalystBreakdownTableContentProps {
  defaultFilters?: Filters;
}

export const MergedAnalystBreakdownTableContent = ({
  defaultFilters,
}: MergedAnalystBreakdownTableContentProps) => {
  const gridRef = useRef<GridApi | null>(null);
  const { filters, setFilters } = useLocalFilters();
  const { metricFlags } = useMetricFlags();
  const { filters: sharedFilters } = useSharedFilters();
  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();
  const { requestDateRange } = useOptimizedDateRange();
  const { isMaximized } = usePanelMaximize();

  const { config, isLoading: isLoadingConfig } =
    useMergedAnalystBreakdownConfig();

  const { data: metricsCatalogData, isLoading: isLoadingCatalog } =
    useGetPortfolioMetricCatalogV3({
      ...metricFlags,
      include_filterable_values: true,
    });

  const metricsCatalog = useMemo(
    () => metricsCatalogData?.metrics ?? [],
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

  const requestBody: MergedAnalystMetricsRequest = useMemo(
    () => ({
      date_range: {
        ...compactDateRangeRequest(effectiveDateRange),
      },
      filters: omitBy(sharedFilters, (item) => !item.length),
    }),
    [effectiveDateRange, sharedFilters]
  );

  const { isFetching: isLoadingInvalidate, refetch: invalidateCache } =
    useGetMergedAlphaAnalystBreakdownStatsEndpoint(
      requestBody,
      { ...metricFlags, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const { data, isLoading, refetch } =
    useGetMergedAlphaAnalystBreakdownStatsEndpoint(requestBody, metricFlags, {
      query: {
        enabled: !!metricsCatalogData,
      },
    });

  const rows = useMemo(
    () => (data?.data ?? []) as unknown as Record<string, unknown>[],
    [data]
  );

  const columns = useMemo(() => {
    const displayColumns = data?.metadata?.display_columns ?? [];
    const groupByColumns = data?.metadata?.group_by ?? [];
    return createMergedAnalystColumns(
      displayColumns,
      groupByColumns,
      metricsCatalog
    );
  }, [data?.metadata, metricsCatalog]);

  const dataGridLayout = useMemo(
    () => ({ mode: isMaximized ? "normal" : "responsive" }) as DataGridLayout,
    [isMaximized]
  );

  const handleRefetch = useCallback(async () => {
    await invalidateCache();
    await refetch();
  }, [invalidateCache, refetch]);

  const isGlobalLoading =
    isLoadingInvalidate || isLoadingCatalog || isLoadingConfig;

  return (
    <WidgetWrapper>
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
            isRefreshing={isLoading || isLoadingInvalidate}
          />
          <WidgetMaximizeButton />
        </WidgetActions>
      </WidgetHeader>
      <div className="py-2">
        <FilterController
          filterOptions={filterOptions}
          selectedFilters={filters}
          setSelectedFilters={setFilters}
          isLoadingMetricsCatalog={isGlobalLoading}
          testId="analyst-breakdown-filter-controller"
          defaultFilters={defaultFilters}
          disableSubFilterPortal
        />
      </div>
      <WidgetBody data-testid="merged-analyst-breakdown-table-body">
        <div className="border-top-no-radius winners-losers-table-ag-grid flex size-full flex-col">
          <DataGrid
            gridRef={gridRef}
            layout={dataGridLayout}
            loading={!!isLoading || !!isGlobalLoading}
            rowData={rows}
            columnDefs={columns}
            autoSizeStrategy={autoSizeStrategy}
            getRowId={getRowId}
            tooltipShowDelay={0}
            tooltipHideDelay={600000}
            {...defaultDataGridProps}
          />
        </div>
      </WidgetBody>
    </WidgetWrapper>
  );
};
