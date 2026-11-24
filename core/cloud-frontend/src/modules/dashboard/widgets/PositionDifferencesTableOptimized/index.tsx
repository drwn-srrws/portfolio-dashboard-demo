import { useCallback, useMemo, useRef } from "react";

import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { MetricMetadata } from "@api/types/index";
import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { DataGrid, DataGridLayout } from "@components/Datagrid/Datagrid";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import FilterController from "@/components/FilterController/FilterController";
import { Filters } from "@/typings/Filters";
import { TextSelect } from "@/components/TextSelect";

import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import { getFilterOptions } from "@/components/FilterController/utils";
import { usePanelDateRange } from "@/hooks/usePanelDateRange";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { GridApi } from "@ag-grid-community/core";
import { exportDatagridToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";
import { useOptimizedDateRange } from "@/providers/OptimizedDateRangeProvider";
import type { DateRangeRequest } from "@/api/aliases";
import { compactDateRangeRequest } from "@/utils/dateRange";

import {
  transformToRowsData,
  createPositionDifferencesColumns,
  autoSizeStrategy,
  defaultDataGridProps,
} from "./utils";

import {
  usePositionDifferencesConfig,
  usePositionDifferencesState,
  usePositionDifferencesData,
  useFormattedPositionDifferencesData,
} from "./hooks";

export interface PositionDifferencesTableOptimizedProps {
  defaultFilters?: Filters;
  defaultCombinationIndex?: number;
}

const PositionDifferencesTableOptimizedContent = ({
  defaultFilters,
  defaultCombinationIndex = 0,
}: PositionDifferencesTableOptimizedProps) => {
  const gridRef = useRef<GridApi | null>(null);

  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags } = useMetricFlags();
  const { isMaximized } = usePanelMaximize();

  const { requestDateRange } = useOptimizedDateRange();
  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();
  const effectiveDateRange: DateRangeRequest = useMemo(() => {
    if (panelStartDate || panelEndDate) {
      return compactDateRangeRequest({
        start_date: panelStartDate,
        end_date: panelEndDate,
      });
    }
    return compactDateRangeRequest(requestDateRange);
  }, [panelEndDate, panelStartDate, requestDateRange]);

  const { config, isLoading: isLoadingConfig } = usePositionDifferencesConfig();

  const { data: metricsCatalogData, isLoading: isLoadingCatalog } =
    useGetPortfolioMetricCatalogV3({
      ...metricFlags,
      include_filterable_values: true,
    });

  const metricsCatalog = useMemo(
    () => metricsCatalogData?.metrics || [],
    [metricsCatalogData]
  );

  const { effectiveFundCombination, setSelectedFundCombination } =
    usePositionDifferencesState(config, defaultCombinationIndex);

  const filterOptions = useMemo(
    () =>
      getFilterOptions(
        metricsCatalogData as MetricMetadata,
        config.supportedFilters
      ),
    [metricsCatalogData, config.supportedFilters]
  );

  const fundCombinationOptions = useMemo(
    () =>
      config.fundCombinations.map((combination) => ({
        value: `${combination.fund_1}-${combination.fund_2}`,
        label: `${combination.fund_1} vs ${combination.fund_2}`,
      })),
    [config.fundCombinations]
  );

  const isDataEnabled =
    !!metricsCatalogData &&
    !!effectiveFundCombination.fund_1 &&
    !!effectiveFundCombination.fund_2 &&
    (!!effectiveDateRange.period ||
      (!!effectiveDateRange.start_date && !!effectiveDateRange.end_date));

  const {
    data: positionDifferencesData,
    metadata: positionDifferencesMetadata,
    isLoading: isLoadingPositionDifferences,
    isLoadingInvalidate,
    refetch,
  } = usePositionDifferencesData({
    dateRange: effectiveDateRange,
    effectiveFundCombination,
    sharedFilters: sharedFilters as Record<string, string[]>,
    enabled: isDataEnabled,
  });

  const { rows, columns } = useFormattedPositionDifferencesData({
    data: positionDifferencesData,
    metadata: positionDifferencesMetadata,
    metricsCatalog,
    transformToRowsData,
    createColumnsFunction: createPositionDifferencesColumns,
  });

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleFundCombinationChange = useCallback(
    (value: string | number | boolean) => {
      const valueStr = String(value);
      const combination = config.fundCombinations.find(
        (c) => `${c.fund_1}-${c.fund_2}` === valueStr
      );
      if (combination) {
        setSelectedFundCombination(combination);
      }
    },
    [config.fundCombinations, setSelectedFundCombination]
  );

  const isGlobalLoading = isLoadingCatalog || isLoadingConfig;
  const isLoading = isLoadingPositionDifferences || isGlobalLoading;

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({
      mode: isMaximized ? "normal" : "responsive",
    }),
    [isMaximized]
  );

  const getRowId = useCallback((data: { id: string }) => data.id, []);

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
            isRefreshing={isLoadingPositionDifferences || isLoadingInvalidate}
          />
          <TextSelect
            disablePortal
            virtual
            options={fundCombinationOptions}
            value={`${effectiveFundCombination.fund_1}-${effectiveFundCombination.fund_2}`}
            placeholder="Select Funds"
            onChange={handleFundCombinationChange}
            testId="position-differences-optimized-fund-combination-select"
          />
          <WidgetMaximizeButton />
        </WidgetActions>
      </WidgetHeader>

      <FilterController
        filterOptions={filterOptions}
        selectedFilters={filters}
        setSelectedFilters={setFilters}
        defaultFilters={defaultFilters}
        isLoadingMetricsCatalog={isGlobalLoading}
        testId="position-differences-optimized-filter-controller"
        disableSubFilterPortal
      />

      <WidgetBody data-testid="position-differences-optimized-body">
        <div className="border-top-no-radius winners-losers-table-ag-grid flex size-full flex-col">
          <DataGrid
            gridRef={gridRef}
            layout={dataGridLayout}
            rowData={rows}
            columnDefs={columns}
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

export const PositionDifferencesTableOptimized = withAppInsights(
  PositionDifferencesTableOptimizedContent,
  "PositionDifferencesTableOptimized"
);
