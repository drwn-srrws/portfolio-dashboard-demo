import { useCallback, useMemo, useRef } from "react";

import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { useGetPortfolioMetricsV3 } from "@/hooks/api/useGetPortfolioMetric";
import { MetricMetadata, MetricRequest } from "@api/types/index";
import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { DataGrid, DataGridLayout } from "@components/Datagrid/Datagrid";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import FilterController from "@/components/FilterController/FilterController";
import { omitBy } from "@/utils/omit";

import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import {
  createAnalystBreakdownColumns,
  defaultDataGridProps,
} from "./AnalystBreakdownTable.column";
import {
  AnalystData,
  transformAnalystData,
} from "./AnalystBreakdownTable.utils";
import {
  GridApi,
  GridState,
  SizeColumnsToContentStrategy,
} from "@ag-grid-community/core";
import { getFilterOptions } from "@/components/FilterController/utils";
import { Filters } from "@/typings/Filters";
import { useDateRange } from "@/providers/DateRangeProvider";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { exportDatagridToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import { usePanelDateRange } from "@/hooks/usePanelDateRange";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";

export interface AnalystBreakdownTableProps {
  defaultFilters?: Filters;
  primaryMetrics: string[];
  primaryGroupByMetrics: string[];
  secondaryMetrics: string[];
  secondaryGroupByMetrics: string[];
  defaultSortDirection: "asc" | "desc";
  benchmarkIds: string[];
}

const autoSizeStrategy: SizeColumnsToContentStrategy = {
  type: "fitCellContents",
};

const getRowId = (data: AnalystData) => data.id;

const AnalystBreakdownTableContent = ({
  defaultFilters,
  benchmarkIds,
  primaryMetrics,
  primaryGroupByMetrics,
  secondaryMetrics,
  secondaryGroupByMetrics,
  defaultSortDirection,
}: AnalystBreakdownTableProps) => {
  const defaultSortByMetric = "primaryPnLPct";
  const gridRef = useRef<GridApi | null>(null);
  const { filters, setFilters } = useLocalFilters();
  const { metricFlags } = useMetricFlags();
  const { filters: sharedFilters } = useSharedFilters();
  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();
  const { startDate, endDate } = useDateRange();
  const { isMaximized } = usePanelMaximize();

  const { data: metricsCatalogData, isLoading: isLoadingCatalog } =
    useGetPortfolioMetricCatalogV3({
      ...metricFlags,
      include_filterable_values: true,
    });

  const filterOptions = useMemo(() => {
    return getFilterOptions(metricsCatalogData as MetricMetadata);
  }, [metricsCatalogData]);

  const metricsCatalogUnfiltered = useMemo(
    () => metricsCatalogData?.metrics || [],
    [metricsCatalogData]
  );

  const primaryMetricsCatalog = useMemo(
    () =>
      metricsCatalogUnfiltered.filter((metric) =>
        primaryMetrics.includes(metric.name)
      ),
    [metricsCatalogUnfiltered, primaryMetrics]
  );

  const secondaryMetricsCatalog = useMemo(
    () =>
      metricsCatalogUnfiltered.filter((metric) =>
        secondaryMetrics.includes(metric.name)
      ),
    [metricsCatalogUnfiltered, secondaryMetrics]
  );

  const parentMetricRequest: MetricRequest = useMemo(
    () => ({
      start_date: panelStartDate ?? startDate,
      end_date: panelEndDate ?? endDate,
      metrics: primaryMetricsCatalog.map((metric) => ({ name: metric.name })),
      group_by: primaryGroupByMetrics,
      filters: omitBy(sharedFilters, (item) => !item.length),
    }),
    [
      panelStartDate,
      startDate,
      panelEndDate,
      endDate,
      primaryMetricsCatalog,
      primaryGroupByMetrics,
      sharedFilters,
    ]
  );

  const childMetricRequest: MetricRequest = useMemo(
    () => ({
      start_date: panelStartDate ?? startDate,
      end_date: panelEndDate ?? endDate,
      metrics: secondaryMetricsCatalog.map((metric) => ({
        name: metric.name,
      })),
      group_by: secondaryGroupByMetrics,
      filters: omitBy(sharedFilters, (item) => !item.length),
    }),
    [
      panelStartDate,
      panelEndDate,
      startDate,
      endDate,
      secondaryMetricsCatalog,
      secondaryGroupByMetrics,
      sharedFilters,
    ]
  );

  const mergedMetricRequest = useMemo(() => {
    if (!benchmarkIds.length) return [parentMetricRequest, childMetricRequest];
    const parentMetricRequestWithBenchmarkId = benchmarkIds.map(
      (benchmarkId) => ({
        ...parentMetricRequest,
        benchmark_id: benchmarkId,
      })
    );
    const childMetricRequestWithBenchmarkId = benchmarkIds.map(
      (benchmarkId) => ({
        ...childMetricRequest,
        benchmark_id: benchmarkId,
      })
    );

    return [
      ...parentMetricRequestWithBenchmarkId,
      ...childMetricRequestWithBenchmarkId,
    ];
  }, [parentMetricRequest, childMetricRequest, benchmarkIds]);

  const {
    isLoading: isLoadingAnalystBreakdownInvalidate,
    refetch: invalidateCache,
  } = useGetPortfolioMetricsV3(
    mergedMetricRequest,
    { ...metricFlags, invalidate_cache: true },
    {
      query: {
        enabled: false,
      },
    }
  );

  const {
    data: analystBreakdownData,
    isLoading: isLoadingAnalystBreakdown,
    refetch: refetchAnalystBreakdown,
  } = useGetPortfolioMetricsV3(mergedMetricRequest, metricFlags, {
    query: {
      enabled: !!metricsCatalogData,
    },
  });

  const analystBreakdownRowsData = useMemo(
    () => transformAnalystData(analystBreakdownData),
    [analystBreakdownData]
  );

  const analystBreakdownColumns = useMemo(
    () =>
      createAnalystBreakdownColumns(
        primaryMetricsCatalog,
        secondaryMetricsCatalog,
        benchmarkIds
      ),
    [primaryMetricsCatalog, secondaryMetricsCatalog, benchmarkIds]
  );

  const initialState: GridState = useMemo(
    () => ({
      sort: {
        sortModel: [
          {
            colId: defaultSortByMetric,
            sort: defaultSortDirection,
          },
        ],
      },
    }),
    [defaultSortByMetric, defaultSortDirection]
  );

  const isLoading = useMemo(
    () => isLoadingAnalystBreakdown || isLoadingCatalog,
    [isLoadingAnalystBreakdown, isLoadingCatalog]
  );

  const dataGridLayout = useMemo(() => {
    return {
      mode: isMaximized ? "normal" : "responsive",
    } as DataGridLayout;
  }, [isMaximized]);

  const handleRefetch = useCallback(async () => {
    await invalidateCache();
    await refetchAnalystBreakdown();
  }, [invalidateCache, refetchAnalystBreakdown]);

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
            isRefreshing={
              isLoadingAnalystBreakdownInvalidate || isLoadingCatalog
            }
          />
          <WidgetMaximizeButton />
        </WidgetActions>
      </WidgetHeader>
      <div className="py-2">
        <FilterController
          filterOptions={filterOptions}
          selectedFilters={filters}
          setSelectedFilters={setFilters}
          isLoadingMetricsCatalog={isLoadingCatalog}
          defaultFilters={defaultFilters}
          testId="analyst-breakdown-filter-controller"
          disableSubFilterPortal
        />
      </div>
      <WidgetBody data-testid="analyst-breakdown-table-body">
        <div className="border-top-no-radius winners-losers-table-ag-grid flex size-full flex-col">
          <DataGrid
            gridRef={gridRef}
            layout={dataGridLayout}
            loading={isLoading}
            rowData={analystBreakdownRowsData}
            columnDefs={analystBreakdownColumns}
            autoSizeStrategy={autoSizeStrategy}
            getRowId={getRowId}
            initialState={initialState}
            tooltipShowDelay={0}
            tooltipHideDelay={600000}
            {...defaultDataGridProps}
          />
        </div>
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const AnalystBreakdownTable = withAppInsights(
  AnalystBreakdownTableContent,
  "AnalystBreakdownTable"
);
