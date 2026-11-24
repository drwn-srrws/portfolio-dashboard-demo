import { useCallback, useMemo, useRef } from "react";

import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { useGetPortfolioMetricsV3 } from "@/hooks/api/useGetPortfolioMetric";
import { MetricMetadata, MetricRequest } from "@api/types/index";
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
  createDynamicAnalystBreakdownColumns,
  defaultDataGridProps,
} from "./AlphaAnalystBreakdownTable.column";
import {
  AnalystBreakdownData,
  transformAnalystBreakdownData,
} from "./AlphaAnalystBreakdownTable.utils";
import { GridApi, SizeColumnsToContentStrategy } from "@ag-grid-community/core";
import { getFilterOptions } from "@/components/FilterController/utils";
import { Filters } from "@/typings/Filters";
import { useDateRange } from "@/providers/DateRangeProvider";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { exportDatagridToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";
import { usePanelDateRange } from "@/hooks/usePanelDateRange";

export interface AnalystBreakdownTableProps {
  defaultFilters?: Filters;
  metrics: string[];
  defaultSortDirection: "asc" | "desc";
  benchmarkIds: string[];
  columnsOrder: string[];
  defaultSortByMetric: string;
}

const autoSizeStrategy: SizeColumnsToContentStrategy = {
  type: "fitCellContents",
};

const getRowId = (data: AnalystBreakdownData) => data.id;

export const AlphaAnalystBreakdownTableContent = ({
  defaultFilters,
  benchmarkIds,
  metrics,
  defaultSortDirection,
  columnsOrder,
  defaultSortByMetric,
}: AnalystBreakdownTableProps) => {
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

  const primaryMetrics = useMemo(() => {
    return ["primary_analyst_avatar", ...metrics];
  }, [metrics]);

  const secondaryMetrics = useMemo(() => {
    return ["secondary_analyst_avatar", ...metrics];
  }, [metrics]);

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

  const primaryMetricRequest: MetricRequest[] = useMemo(
    () =>
      benchmarkIds.map((benchmarkId) => ({
        start_date: panelStartDate ?? startDate,
        end_date: panelEndDate ?? endDate,
        metrics: primaryMetricsCatalog.map((metric) => ({
          name: metric.name,
        })),
        group_by: ["primary_analyst"],
        benchmark_id: benchmarkId,
        filters: omitBy(sharedFilters, (item) => !item.length),
        sort_by: {
          sort_by: [defaultSortByMetric],
          sort_descending: defaultSortDirection === "desc",
        },
      })),
    [
      panelStartDate,
      panelEndDate,
      startDate,
      endDate,
      primaryMetricsCatalog,
      sharedFilters,
      benchmarkIds,
      defaultSortByMetric,
      defaultSortDirection,
    ]
  );

  const secondaryMetricRequest: MetricRequest[] = useMemo(
    () =>
      benchmarkIds.map((benchmarkId) => ({
        start_date: panelStartDate ?? startDate,
        end_date: panelEndDate ?? endDate,
        metrics: secondaryMetricsCatalog.map((metric) => ({
          name: metric.name,
        })),
        group_by: ["secondary_analyst"],
        benchmark_id: benchmarkId,
        filters: omitBy(sharedFilters, (item) => !item.length),
        sort_by: {
          sort_by: [defaultSortByMetric],
          sort_descending: defaultSortDirection === "desc",
        },
      })),
    [
      panelStartDate,
      panelEndDate,
      startDate,
      endDate,
      secondaryMetricsCatalog,
      sharedFilters,
      benchmarkIds,
      defaultSortByMetric,
      defaultSortDirection,
    ]
  );

  const {
    isLoading: isLoadingPrimaryAnalystInvalidate,
    refetch: invalidatePrimaryCache,
  } = useGetPortfolioMetricsV3(
    primaryMetricRequest,
    { ...metricFlags, invalidate_cache: true },
    {
      query: { enabled: false },
    }
  );

  const {
    data: primaryAnalystBreakdownData,
    isLoading: isLoadingPrimaryAnalystBreakdown,
    refetch: refetchPrimaryAnalyst,
  } = useGetPortfolioMetricsV3(primaryMetricRequest, metricFlags, {
    query: {
      enabled: !!metricsCatalogData,
    },
  });

  const {
    isLoading: isLoadingSecondaryAnalystInvalidate,
    refetch: invalidateSecondaryCache,
  } = useGetPortfolioMetricsV3(
    secondaryMetricRequest,
    { ...metricFlags, invalidate_cache: true },
    {
      query: { enabled: false },
    }
  );

  const {
    data: secondaryAnalystBreakdownData,
    isLoading: isLoadingSecondaryAnalystBreakdown,
    refetch: refetchSecondaryAnalyst,
  } = useGetPortfolioMetricsV3(secondaryMetricRequest, metricFlags, {
    query: {
      enabled: !!metricsCatalogData,
    },
  });

  const primaryAnalystBreakdownDataTransformed = useMemo(() => {
    if (primaryAnalystBreakdownData) {
      return transformAnalystBreakdownData(
        primaryAnalystBreakdownData,
        benchmarkIds,
        primaryMetricsCatalog
      );
    }
    return [];
  }, [primaryAnalystBreakdownData, benchmarkIds, primaryMetricsCatalog]);

  const secondaryAnalystBreakdownDataTransformed = useMemo(() => {
    if (secondaryAnalystBreakdownData) {
      return transformAnalystBreakdownData(
        secondaryAnalystBreakdownData,
        benchmarkIds,
        secondaryMetricsCatalog
      );
    }
    return [];
  }, [secondaryAnalystBreakdownData, benchmarkIds, secondaryMetricsCatalog]);

  const primaryAnalystBreakdownColumns = useMemo(
    () =>
      createDynamicAnalystBreakdownColumns(
        primaryMetricsCatalog,
        benchmarkIds,
        columnsOrder
      ),
    [primaryMetricsCatalog, benchmarkIds, columnsOrder]
  );
  const secondaryColumnsOrder = useMemo(() => {
    return [
      "secondary_analyst_avatar",
      ...columnsOrder.filter((column) => column !== "primary_analyst_avatar"),
    ];
  }, [columnsOrder]);

  const secondaryAnalystBreakdownColumns = useMemo(
    () =>
      createDynamicAnalystBreakdownColumns(
        secondaryMetricsCatalog,
        benchmarkIds,
        secondaryColumnsOrder
      ),
    [secondaryMetricsCatalog, benchmarkIds, secondaryColumnsOrder]
  );

  const isLoading = useMemo(
    () =>
      isLoadingPrimaryAnalystBreakdown ||
      isLoadingCatalog ||
      isLoadingSecondaryAnalystBreakdown,
    [
      isLoadingPrimaryAnalystBreakdown,
      isLoadingCatalog,
      isLoadingSecondaryAnalystBreakdown,
    ]
  );

  const dataGridLayout = useMemo(() => {
    return {
      mode: isMaximized ? "normal" : "responsive",
    } as DataGridLayout;
  }, [isMaximized]);

  const handleRefetch = useCallback(async () => {
    await Promise.all([invalidatePrimaryCache(), invalidateSecondaryCache()]);
    await Promise.all([refetchPrimaryAnalyst(), refetchSecondaryAnalyst()]);
  }, [
    invalidatePrimaryCache,
    invalidateSecondaryCache,
    refetchPrimaryAnalyst,
    refetchSecondaryAnalyst,
  ]);

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
              isLoadingPrimaryAnalystInvalidate ||
              isLoadingSecondaryAnalystInvalidate ||
              isLoadingCatalog
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
        <div className="border-top-no-radius winners-losers-table-ag-grid flex size-full flex-col gap-2 h-full">
          <div className="h-1/2 w-full">
            <DataGrid
              gridRef={gridRef}
              layout={dataGridLayout}
              loading={isLoading}
              autoSizeStrategy={{
                type: "fitCellContents",
              }}
              rowData={primaryAnalystBreakdownDataTransformed}
              columnDefs={primaryAnalystBreakdownColumns}
              getRowId={getRowId}
              tooltipShowDelay={0}
              tooltipHideDelay={600000}
              {...defaultDataGridProps}
            />
          </div>
          <div className="h-1/2 w-full">
            <DataGrid
              gridRef={gridRef}
              layout={dataGridLayout}
              loading={isLoading}
              rowData={secondaryAnalystBreakdownDataTransformed}
              columnDefs={secondaryAnalystBreakdownColumns}
              autoSizeStrategy={autoSizeStrategy}
              getRowId={getRowId}
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
