import {
  SizeColumnsToContentStrategy,
  GridState,
  GridApi,
} from "@ag-grid-community/core";
import { useCallback, useMemo, useRef } from "react";

import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { MetricMetadata } from "@api/types/index";
import { DataGrid, DataGridLayout } from "@components/Datagrid/Datagrid";
import { Filters } from "@/typings/Filters";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import FilterController from "@/components/FilterController/FilterController";
import { TextSelect } from "@/components/TextSelect";
import { SkeletonWrapper } from "@components/SkeletonWrapper/SkeletonWrapper";
import { getFilterOptions } from "@/components/FilterController/utils";
import { WidgetActions } from "@/components/Widget/WidgetActions";
import { WidgetBody } from "@/components/Widget/WidgetBody";
import { WidgetHeader } from "@/components/Widget/WidgetHeader";
import WidgetMaximizeButton from "@/components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "@/components/Widget/WidgetTitle";
import { WidgetWrapper } from "@/components/Widget/WidgetWrapper";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";
import { withAppInsights } from "@/modules/app-insights/hocs/withAppInsights";
import { usePanelDateRange } from "@/hooks/usePanelDateRange";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { exportDatagridToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import { useOptimizedDateRange } from "@/providers/OptimizedDateRangeProvider";
import type { DateRangeRequest } from "@/api/aliases";
import { compactDateRangeRequest } from "@/utils/dateRange";

import {
  battingAndSluggingDefaultColDef,
  createAutoGroupColumnDef,
  createBattingAndSluggingColumns,
} from "./BattingAndSluggingTable.columns";
import {
  buildNestedRows,
  createTotalRow,
  getDisplayColumnsFromResponse,
  getGroupingFieldsFromResponse,
} from "./BattingAndSluggingTable.utils";

import {
  useBattingSluggingConfig,
  useBattingSluggingState,
  useBattingSluggingData,
  useFormattedBattingSluggingData,
} from "./hooks";

export interface BattingAndSluggingTableProps {
  defaultGroupByMetric: string;
  defaultSortByMetric: string;
  defaultSortDirection: "asc" | "desc";
  defaultFilters?: Filters;
}

const autoSizeStrategy: SizeColumnsToContentStrategy = {
  type: "fitCellContents",
};

const getDataPath = (data: { uniqueIds: string[] }) => data.uniqueIds;
const getRowId = (data: { uniqueIds: string[] }) => data.uniqueIds.join("-");

const BattingAndSluggingTableContent = ({
  defaultGroupByMetric,
  defaultSortByMetric,
  defaultSortDirection,
  defaultFilters,
}: BattingAndSluggingTableProps) => {
  const gridRef = useRef<GridApi | null>(null);
  const { filters, setFilters } = useLocalFilters();
  const { metricFlags } = useMetricFlags();
  const { filters: sharedFilters } = useSharedFilters();
  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();
  const { isMaximized } = usePanelMaximize();

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

  const { data: catalogData, isLoading: isLoadingCatalog } =
    useGetPortfolioMetricCatalogV3({
      ...metricFlags,
      include_filterable_values: true,
    });

  const metricsCatalog = useMemo(
    () => catalogData?.metrics || [],
    [catalogData?.metrics]
  );

  const { config, isLoading: isLoadingConfig } = useBattingSluggingConfig();

  const filterOptions = useMemo(
    () =>
      getFilterOptions(catalogData as MetricMetadata, config.supportedFilters),
    [catalogData, config.supportedFilters]
  );

  const { effectiveGroupBy, setSelectedGroupBy } = useBattingSluggingState(
    config,
    defaultGroupByMetric
  );

  const isDataEnabled =
    !!catalogData &&
    !isLoadingConfig &&
    (!!effectiveDateRange.period ||
      (!!effectiveDateRange.start_date && !!effectiveDateRange.end_date));

  const {
    responses,
    totalData,
    isLoading: isLoadingData,
    isLoadingInvalidate,
    refetch,
  } = useBattingSluggingData({
    dateRange: effectiveDateRange,
    effectiveGroupBy,
    sharedFilters: sharedFilters as Record<string, string[]>,
    enabled: isDataEnabled,
  });

  const {
    formattedData,
    totalRowData,
    columns,
    autoGroupColumnDef,
    groupByFields,
  } = useFormattedBattingSluggingData({
    responses,
    totalData,
    metricsCatalog,
    buildNestedRows,
    createTotalRow,
    getDisplayColumnsFromResponse,
    getGroupingFieldsFromResponse,
    createColumnsFunction: createBattingAndSluggingColumns,
    createAutoGroupColumnDef,
  });

  const displayOptions = useMemo(() => {
    const dims = config.selectableDimensions || [];
    return dims.map((dim) => ({
      label: metricsCatalog.find((m) => m.name === dim)?.display_name || dim,
      value: dim,
    }));
  }, [config.selectableDimensions, metricsCatalog]);

  const initialState: GridState = useMemo(
    () => ({
      sort: {
        sortModel: [{ colId: defaultSortByMetric, sort: defaultSortDirection }],
      },
    }),
    [defaultSortByMetric, defaultSortDirection]
  );

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({ mode: isMaximized ? "normal" : "responsive" }),
    [isMaximized]
  );

  const isLoading = isLoadingCatalog || isLoadingConfig || isLoadingData;

  const exportToCSV = useCallback(
    (name: string) => exportDatagridToCSV(gridRef, name, groupByFields),
    [groupByFields]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <WidgetWrapper>
      <WidgetHeader>
        <WidgetTitle exportToCSV={exportToCSV}>
          Batting & Slugging Stats
        </WidgetTitle>
        <WidgetActions>
          <WidgetRefetchButton
            onRefetch={handleRefetch}
            isRefreshing={isLoadingData || isLoadingInvalidate}
          />
          <SkeletonWrapper
            isLoading={isLoadingConfig || isLoadingCatalog}
            skeletonClassName="h-9 w-[128px]"
          >
            <TextSelect
              virtual
              disablePortal
              placeholder="Aggregate By"
              options={displayOptions}
              value={effectiveGroupBy}
              onChange={(v) => setSelectedGroupBy(String(v))}
              testId="batting-and-slugging-optimized-group-by-select"
            />
          </SkeletonWrapper>
          <WidgetMaximizeButton id="batting-and-slugging-maximize-button" />
        </WidgetActions>
      </WidgetHeader>

      <FilterController
        id="batting-and-slugging-filter-controller"
        filterOptions={filterOptions}
        selectedFilters={filters}
        setSelectedFilters={setFilters}
        defaultFilters={defaultFilters}
        testId="batting-and-slugging-optimized-filter-controller"
        disableSubFilterPortal
      />

      <WidgetBody data-testid="batting-and-slugging-table-body">
        <DataGrid
          gridRef={gridRef}
          layout={dataGridLayout}
          rowData={formattedData as { uniqueIds: string[] }[]}
          columnDefs={columns}
          autoSizeStrategy={autoSizeStrategy}
          defaultColDef={battingAndSluggingDefaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          sideBar={false}
          suppressAggFuncInHeader
          animateRows={false}
          getDataPath={getDataPath}
          loading={isLoading}
          getRowId={getRowId}
          treeData
          stopEditingWhenCellsLoseFocus
          initialState={initialState}
          tooltipShowDelay={0}
          tooltipHideDelay={600000}
          pinnedBottomRowData={totalRowData as { uniqueIds: string[] }[]}
        />
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const BattingAndSluggingTable = withAppInsights(
  BattingAndSluggingTableContent,
  "BattingAndSluggingTable"
);
