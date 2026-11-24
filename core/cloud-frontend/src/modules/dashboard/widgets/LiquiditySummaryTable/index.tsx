import { ColDef, GridApi } from "@ag-grid-community/core";
import { useCallback, useMemo, useRef } from "react";

import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { useGetPortfolioMetricsV3 } from "@/hooks/api/useGetPortfolioMetric";
import { MetricMetadata, MetricRequest } from "@api/types/index";
import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { Filters } from "@/typings/Filters";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import FilterController from "@/components/FilterController/FilterController";
import { omitBy } from "@/utils/omit";
import { formatDataToNestedTableData } from "@/utils/table";

import { DataGrid, DataGridLayout } from "@components/Datagrid/index";
import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import {
  autoSizeStrategy,
  createLiquiditySummaryColumns,
  defaultDataGridProps,
} from "./LiquiditySummaryTable.columns";
import { getFilterOptions } from "@/components/FilterController/utils";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useDateRange } from "@/providers/DateRangeProvider";
import { usePanelDateRange } from "@/hooks/usePanelDateRange";
import { exportDatagridToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";

export interface LiquiditySummaryTableProps {
  defaultMetrics: string[];
  defaultGroupByMetric: string;
  defaultSubgroupBy: string;
  defaultFilters?: Filters;
}

const getDataPath = (data: { uniqueIds: string[] }) => data.uniqueIds;

const getRowId = (data: { uniqueIds: string[] }) => data.uniqueIds.join("-");

const LiquiditySummaryTableContent = ({
  defaultMetrics,
  defaultGroupByMetric,
  defaultSubgroupBy,
  defaultFilters,
}: LiquiditySummaryTableProps) => {
  const gridRef = useRef<GridApi | null>(null);

  const { isMaximized } = usePanelMaximize();
  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags } = useMetricFlags();

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

  const metricsCatalog = useMemo(
    () =>
      metricsCatalogUnfiltered.filter((metric) =>
        defaultMetrics.includes(metric.name)
      ),
    [metricsCatalogUnfiltered, defaultMetrics]
  );

  const parentMetricRequest: MetricRequest = useMemo(
    () => ({
      start_date: panelStartDate ?? startDate,
      end_date: panelEndDate ?? endDate,
      metrics: metricsCatalog.map((option) => ({ name: option.name })),
      group_by: [defaultGroupByMetric],
      sort_by: {
        sort_by: [defaultGroupByMetric],
        sort_descending: false,
      },
      filters: omitBy(sharedFilters, (item) => !item.length),
    }),
    [
      panelStartDate,
      panelEndDate,
      startDate,
      endDate,
      metricsCatalog,
      defaultGroupByMetric,
      sharedFilters,
    ]
  );

  const childMetricRequest: MetricRequest = useMemo(
    () => ({
      start_date: panelStartDate ?? startDate,
      end_date: panelEndDate ?? endDate,
      metrics: metricsCatalog.map((option) => ({ name: option.name })),
      group_by: [defaultGroupByMetric, defaultSubgroupBy],
      sort_by: {
        sort_by: ["company_netted_gmv_percent_nav"],
        sort_descending: true,
      },
      filters: omitBy(sharedFilters, (item) => !item.length),
    }),
    [
      panelStartDate,
      panelEndDate,
      startDate,
      endDate,
      metricsCatalog,
      defaultGroupByMetric,
      defaultSubgroupBy,
      sharedFilters,
    ]
  );

  const {
    isLoading: isLoadingLiquiditySummaryInvalidate,
    refetch: invalidateCache,
  } = useGetPortfolioMetricsV3(
    [parentMetricRequest, childMetricRequest],
    { ...metricFlags, invalidate_cache: true },
    { query: { enabled: false } }
  );

  const {
    data: liquidity,
    isLoading: isLoadingLiquiditySummary,
    refetch: refetchLiquidity,
  } = useGetPortfolioMetricsV3(
    [parentMetricRequest, childMetricRequest],
    metricFlags,
    {
      query: {
        enabled: !!metricsCatalogData,
      },
    }
  );

  const liquidityData = useMemo(() => liquidity?.[0]?.data || [], [liquidity]);

  const liquidityNestedData = useMemo(
    () => liquidity?.[1]?.data || [],
    [liquidity]
  );

  const formatedData = useMemo(() => {
    return formatDataToNestedTableData({
      topLevelEntries: liquidityData,
      nestedEntries: liquidityNestedData,
      primaryGroupingField: defaultGroupByMetric,
      secondaryGroupingField: defaultSubgroupBy,
    });
  }, [
    defaultGroupByMetric,
    defaultSubgroupBy,
    liquidityData,
    liquidityNestedData,
  ]);

  const groupByMetric = useMemo(
    () => metricsCatalogUnfiltered.find((m) => m.name === defaultGroupByMetric),
    [metricsCatalogUnfiltered, defaultGroupByMetric]
  );

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerName: "Days to cover",
      headerTooltip:
        groupByMetric?.description || groupByMetric?.display_name || "",
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      resizeable: true,
      colId: defaultGroupByMetric,
    };
  }, [defaultGroupByMetric, groupByMetric]);

  const columns = useMemo(
    () => createLiquiditySummaryColumns(metricsCatalog, defaultMetrics),
    [metricsCatalog, defaultMetrics]
  );

  const isLoading = useMemo(
    () => isLoadingCatalog || isLoadingLiquiditySummary,
    [isLoadingCatalog, isLoadingLiquiditySummary]
  );

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({
      mode: isMaximized ? "normal" : "responsive",
    }),
    [isMaximized]
  );

  const handleRefetch = useCallback(async () => {
    await invalidateCache();
    await refetchLiquidity();
  }, [invalidateCache, refetchLiquidity]);

  return (
    <WidgetWrapper data-testid="liquidity-summary-widget">
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
            isRefreshing={
              isLoadingLiquiditySummaryInvalidate || isLoadingCatalog
            }
          />
          <WidgetMaximizeButton id="liquidity-summary-maximize-button" />
        </WidgetActions>
      </WidgetHeader>

      <FilterController
        testId="liquidity-summary-filter-controller"
        filterOptions={filterOptions}
        selectedFilters={filters}
        setSelectedFilters={setFilters}
        defaultFilters={defaultFilters}
        disableSubFilterPortal
      />

      <WidgetBody data-testid="liquidity-summary-table-body">
        <DataGrid
          gridRef={gridRef}
          layout={dataGridLayout}
          loading={isLoading}
          rowData={formatedData}
          columnDefs={columns}
          autoSizeStrategy={autoSizeStrategy}
          autoGroupColumnDef={autoGroupColumnDef}
          rowSelection="multiple"
          getDataPath={getDataPath}
          getRowId={getRowId}
          {...defaultDataGridProps}
        />
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const LiquiditySummaryTable = withAppInsights(
  LiquiditySummaryTableContent,
  "LiquiditySummaryTable"
);
