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
  autoSizeStrategy,
  createPositionDifferencesColumns,
  defaultDataGridProps,
} from "./PositionDifferencesTable.column";
import { transformToRowsData } from "./PositionDifferencesTable.utils";
import { getFilterOptions } from "@/components/FilterController/utils";
import { Filters } from "@/typings/Filters";
import { useDateRange } from "@/providers/DateRangeProvider";
import { usePanelDateRange } from "@/hooks/usePanelDateRange";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { GridApi } from "@ag-grid-community/core";
import { exportDatagridToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";

export interface PositionDifferencesTableProps {
  defaultFilters?: Filters;
  metrics: string[];
  groupByMetrics: string[];
  fundNames: string[];
}
const getRowId = (data: { id: string }) => data.id;

const PositionDifferencesTableContent = ({
  defaultFilters,
  fundNames,
  metrics,
  groupByMetrics,
}: PositionDifferencesTableProps) => {
  const gridRef = useRef<GridApi | null>(null);
  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags } = useMetricFlags();
  const { isMaximized } = usePanelMaximize();

  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();
  const { startDate, endDate } = useDateRange();

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

  const metricsCatalog = useMemo(() => {
    return metricsCatalogUnfiltered.filter((metric) =>
      metrics.includes(metric.name)
    );
  }, [metricsCatalogUnfiltered, metrics]);

  const metricRequests: MetricRequest[] = useMemo(() => {
    return fundNames.map((fund) => ({
      start_date: panelStartDate ?? startDate,
      end_date: panelEndDate ?? endDate,
      metrics: metricsCatalog.map((metric) => ({ name: metric.name })),
      group_by: groupByMetrics,
      filters: {
        ...omitBy(sharedFilters, (item) => !item.length),
        fund_name: [fund],
      },
    }));
  }, [
    panelStartDate,
    panelEndDate,
    startDate,
    endDate,
    metricsCatalog,
    groupByMetrics,
    sharedFilters,
    fundNames,
  ]);

  const {
    isLoading: isLoadingPositionDifferencesInvalidate,
    refetch: invalidateCache,
  } = useGetPortfolioMetricsV3(
    metricRequests,
    { ...metricFlags, invalidate_cache: true },
    { query: { enabled: false } }
  );

  const {
    data: positionDifferences,
    isLoading: isLoadingPositionDifferences,
    refetch: refetchPositionDifferences,
  } = useGetPortfolioMetricsV3(metricRequests, metricFlags, {
    query: {
      enabled: !!metricsCatalogData,
    },
  });

  const positionDifferencesRows = useMemo(
    () =>
      transformToRowsData(
        positionDifferences?.flatMap((fund) => fund.data || []) || []
      ),
    [positionDifferences]
  );

  const positionDifferencesColumns = useMemo(
    () =>
      createPositionDifferencesColumns(
        metricsCatalog,
        positionDifferences?.flatMap((fund) => fund.data || []) || []
      ),
    [positionDifferences, metricsCatalog]
  );

  const isLoading = useMemo(() => {
    return isLoadingPositionDifferences || isLoadingCatalog;
  }, [isLoadingPositionDifferences, isLoadingCatalog]);

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({
      mode: isMaximized ? "normal" : "responsive",
    }),
    [isMaximized]
  );

  const handleRefetch = useCallback(async () => {
    await invalidateCache();
    await refetchPositionDifferences();
  }, [invalidateCache, refetchPositionDifferences]);

  return (
    <WidgetWrapper>
      <WidgetHeader>
        <WidgetTitle
          {...{
            exportToCSV: (name) => exportDatagridToCSV(gridRef, name),
          }}
        >
          Position Differences
        </WidgetTitle>
        <WidgetActions>
          <WidgetRefetchButton
            onRefetch={handleRefetch}
            isRefreshing={
              isLoadingPositionDifferencesInvalidate || isLoadingCatalog
            }
          />
          <WidgetMaximizeButton />
        </WidgetActions>
      </WidgetHeader>

      <FilterController
        filterOptions={filterOptions}
        selectedFilters={filters}
        setSelectedFilters={setFilters}
        isLoadingMetricsCatalog={isLoadingCatalog}
        defaultFilters={defaultFilters}
        testId="position-differences-filter-controller"
        disableSubFilterPortal
      />

      <WidgetBody data-testid="position-differences-table-body">
        <div className="border-top-no-radius winners-losers-table-ag-grid flex size-full flex-col">
          <DataGrid
            gridRef={gridRef}
            layout={dataGridLayout}
            rowData={positionDifferencesRows}
            columnDefs={positionDifferencesColumns}
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

export const PositionDifferencesTable = withAppInsights(
  PositionDifferencesTableContent,
  "PositionDifferencesTable"
);
