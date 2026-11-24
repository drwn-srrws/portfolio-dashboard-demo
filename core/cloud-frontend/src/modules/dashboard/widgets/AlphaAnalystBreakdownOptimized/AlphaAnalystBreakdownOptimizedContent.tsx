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
import type { Filters } from "@/typings/Filters";
import type { TeamAnalystBreakdownRequest } from "@/api/types";
import type { DateRangeRequest } from "@/api/aliases";
import { useGetPortfolioMetricsCatalog } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import type { MetricMetadata } from "@/api/types";

import {
  useAlphaAnalystBreakdownConfig,
  useAlphaAnalystBreakdownData,
} from "./hooks";
import {
  createAlphaAnalystBreakdownColumns,
  defaultDataGridProps,
} from "./utils";

const autoSizeStrategy: SizeColumnsToFitGridStrategy = {
  type: "fitGridWidth",
};

export interface AlphaAnalystBreakdownOptimizedContentProps {
  defaultFilters?: Filters;
  benchmarkIds: string[];
}

const getRowIdFactory =
  (groupByCol?: string) => (data: Record<string, unknown>) =>
    String((groupByCol ? data[groupByCol] : undefined) ?? "");

export const AlphaAnalystBreakdownOptimizedContent = ({
  defaultFilters,
  benchmarkIds,
}: AlphaAnalystBreakdownOptimizedContentProps) => {
  const gridRef = useRef<GridApi | null>(null);
  const { filters, setFilters } = useLocalFilters();
  const { metricFlags } = useMetricFlags();
  const { filters: sharedFilters } = useSharedFilters();
  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();
  const { requestDateRange } = useOptimizedDateRange();
  const { isMaximized } = usePanelMaximize();

  const { config, isLoading: isLoadingConfig } =
    useAlphaAnalystBreakdownConfig();

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
        v3CatalogData as unknown as MetricMetadata,
        config.supportedFilters
      ),
    [v3CatalogData, config.supportedFilters]
  );

  const effectiveDateRange: DateRangeRequest = useMemo(() => {
    if (panelStartDate || panelEndDate) {
      return {
        start_date: panelStartDate ?? null,
        end_date: panelEndDate ?? null,
        period: null,
      };
    }
    return requestDateRange;
  }, [panelEndDate, panelStartDate, requestDateRange]);

  const isDataEnabled =
    !!v3CatalogData &&
    (!!effectiveDateRange.period ||
      (!!effectiveDateRange.start_date && !!effectiveDateRange.end_date));

  const requestBody: TeamAnalystBreakdownRequest = useMemo(() => {
    const cleanedFilters = omitBy(
      { ...filters, ...sharedFilters },
      (item) => !item.length
    );

    return {
      date_range: {
        start_date: effectiveDateRange.start_date ?? null,
        end_date: effectiveDateRange.end_date ?? null,
        period: effectiveDateRange.period ?? null,
      },
      filters: cleanedFilters as TeamAnalystBreakdownRequest["filters"],
      benchmark_ids: benchmarkIds,
    };
  }, [benchmarkIds, effectiveDateRange, filters, sharedFilters]);

  const { isFetching: isLoadingInvalidate, refetch: invalidateCache } =
    useAlphaAnalystBreakdownData({
      payload: requestBody,
      params: {
        explode_composites: metricFlags.explode_composites,
        invalidate_cache: true,
      },
      enabled: false,
    });

  const {
    data: response,
    isLoading: isLoadingData,
    refetch,
  } = useAlphaAnalystBreakdownData({
    payload: requestBody,
    params: { explode_composites: metricFlags.explode_composites },
    enabled: isDataEnabled,
  });

  const primarySection = response?.data?.[0];
  const secondarySection = response?.data?.[1];

  const primaryDisplayColumns = useMemo(
    () => primarySection?.metadata?.display_columns ?? [],
    [primarySection]
  );
  const secondaryDisplayColumns = useMemo(
    () => secondarySection?.metadata?.display_columns ?? [],
    [secondarySection]
  );

  const primaryGroupByCol = useMemo(
    () =>
      (primarySection?.metadata?.group_by as string[] | null)?.[0] ?? undefined,
    [primarySection]
  );
  const secondaryGroupByCol = useMemo(
    () =>
      (secondarySection?.metadata?.group_by as string[] | null)?.[0] ??
      undefined,
    [secondarySection]
  );

  const primaryRows = useMemo(
    () => (primarySection?.data ?? []) as unknown as Record<string, unknown>[],
    [primarySection]
  );
  const secondaryRows = useMemo(
    () =>
      (secondarySection?.data ?? []) as unknown as Record<string, unknown>[],
    [secondarySection]
  );

  const primaryColumns = useMemo(
    () =>
      createAlphaAnalystBreakdownColumns(primaryDisplayColumns, metricsCatalog),
    [primaryDisplayColumns, metricsCatalog]
  );
  const secondaryColumns = useMemo(
    () =>
      createAlphaAnalystBreakdownColumns(
        secondaryDisplayColumns,
        metricsCatalog
      ),
    [secondaryDisplayColumns, metricsCatalog]
  );

  const dataGridLayout = useMemo(
    () => ({ mode: isMaximized ? "normal" : "responsive" }) as DataGridLayout,
    [isMaximized]
  );

  const handleRefetch = useCallback(async () => {
    await invalidateCache();
    await refetch();
  }, [invalidateCache, refetch]);

  const isGlobalLoading =
    isLoadingV3Catalog || isLoadingPmCatalog || isLoadingConfig;
  const isLoading = isLoadingInvalidate || isLoadingData || isGlobalLoading;

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
            isRefreshing={isLoading}
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

      <WidgetBody data-testid="alpha-analyst-breakdown-optimized-table-body">
        <div className="border-top-no-radius winners-losers-table-ag-grid flex size-full flex-col gap-2 h-full">
          <div className="h-1/2 w-full">
            <DataGrid
              gridRef={gridRef}
              layout={dataGridLayout}
              loading={isLoading}
              rowData={primaryRows}
              columnDefs={primaryColumns}
              autoSizeStrategy={autoSizeStrategy}
              getRowId={getRowIdFactory(primaryGroupByCol)}
              tooltipShowDelay={0}
              tooltipHideDelay={600000}
              {...defaultDataGridProps}
            />
          </div>
          <div className="h-1/2 w-full">
            <DataGrid
              layout={dataGridLayout}
              loading={isLoading}
              rowData={secondaryRows}
              columnDefs={secondaryColumns}
              autoSizeStrategy={autoSizeStrategy}
              getRowId={getRowIdFactory(secondaryGroupByCol)}
              tooltipShowDelay={0}
              tooltipHideDelay={600000}
              {...defaultDataGridProps}
            />
          </div>
        </div>
      </WidgetBody>
    </WidgetWrapper>
  );
};
