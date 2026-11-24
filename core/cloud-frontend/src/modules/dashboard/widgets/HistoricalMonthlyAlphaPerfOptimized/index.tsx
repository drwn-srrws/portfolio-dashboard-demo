import { GridApi } from "@ag-grid-community/core";
import { useCallback, useMemo, useRef, useState } from "react";

import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { MetricMetadata } from "@api/types/index";
import { DataGrid, DataGridLayout } from "@components/Datagrid/Datagrid";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import FilterController from "@/components/FilterController/FilterController";
import { Filters } from "@/typings/Filters";
import { TextSelect } from "@/components/TextSelect";
import { SkeletonWrapper } from "@components/SkeletonWrapper/SkeletonWrapper";
import { useSelection } from "@hooks/useSelection";
import { useSharedYear } from "@/hooks/useSharedYear";

import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import { getFilterOptions } from "@/components/FilterController/utils";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import { exportDatagridToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import { useIsMobile } from "@/hooks/useMobile";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";
import { years } from "../MonthlyPerformance/components/MonthlyPerformanceTable/MonthlyPerformanceTable.utils";

import {
  buildMonthlyPerformanceColumns,
  autoSizeStrategy,
  defaultGridProps,
} from "./utils";
import {
  useHistoricalMonthlyAlphaPerfConfig,
  useHistoricalMonthlyAlphaPerfData,
} from "./hooks";

interface HistoricalMonthlyAlphaPerfSelection {
  groupBy: string;
  benchmarkId: string;
}

export interface HistoricalMonthlyAlphaPerfOptimizedProps {
  defaultFilters?: Filters;
}

const HistoricalMonthlyAlphaPerfOptimizedContent = ({
  defaultFilters,
}: HistoricalMonthlyAlphaPerfOptimizedProps) => {
  const gridRef = useRef<GridApi | null>(null);
  const [alphaType, setAlphaType] = useState<string | undefined>(undefined);
  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { isMaximized } = usePanelMaximize();
  const isMobile = useIsMobile();
  const { selectedYear, setSelectedLocalYear: setLocalYear } = useSharedYear();

  const combinedFilters = useMemo(
    () => ({ ...defaultFilters, ...sharedFilters }),
    [defaultFilters, sharedFilters]
  );

  const { config, isLoading: isLoadingConfig } =
    useHistoricalMonthlyAlphaPerfConfig(combinedFilters);

  const { selection, handleSelectionChange } =
    useSelection<HistoricalMonthlyAlphaPerfSelection>({
      groupBy: config.defaultGroupBy,
      benchmarkId: "",
    });

  const { data: metricsCatalogData, isLoading: isLoadingCatalog } =
    useGetPortfolioMetricCatalogV3({
      include_filterable_values: true,
    });

  const metricsCatalog = useMemo(
    () => metricsCatalogData?.metrics || [],
    [metricsCatalogData]
  );

  const groupByOptions = useMemo(
    () =>
      config.groupByOptions.map((field) => {
        const entry = metricsCatalog.find((m) => m.name === field);
        return { label: entry?.display_name ?? field, value: field };
      }),
    [config.groupByOptions, metricsCatalog]
  );

  const benchmarkOptions = useMemo(() => {
    return Object.entries(config.benchmarks).map(([id, name]) => ({
      label: name,
      value: id,
    }));
  }, [config.benchmarks]);

  const effectiveBenchmarkId = selection.benchmarkId || config.benchmarkId;

  const filterOptions = useMemo(
    () =>
      getFilterOptions(
        metricsCatalogData as MetricMetadata,
        config.supportedFilters
      ),
    [metricsCatalogData, config.supportedFilters]
  );

  const selectedMetric = alphaType;

  const isDataEnabled =
    !!selectedYear && !isLoadingConfig && !!effectiveBenchmarkId;

  const {
    response,
    isLoading: isLoadingData,
    isLoadingInvalidate,
    refetch,
  } = useHistoricalMonthlyAlphaPerfData({
    groupBy: selection.groupBy,
    year: parseInt(selectedYear, 10),
    benchmarkId: effectiveBenchmarkId,
    metric: selectedMetric,
    sharedFilters: combinedFilters,
    enabled: isDataEnabled,
  });

  const alphaTypeOptions = useMemo(
    () =>
      (response?.metadata?.selectable_display_dimensions ?? []).map((dim) => {
        const entry = metricsCatalog.find((m) => m.name === dim);
        return { label: entry?.display_name ?? dim, value: dim };
      }),
    [response?.metadata?.selectable_display_dimensions, metricsCatalog]
  );

  const displayColumns = useMemo(
    () => response?.metadata?.display_columns ?? [],
    [response]
  );

  const groupByKey = useMemo(
    () => response?.metadata?.group_by?.[0] ?? selection.groupBy,
    [response, selection.groupBy]
  );

  const groupByCatalogEntry = useMemo(
    () => metricsCatalog.find((m) => m.name === groupByKey),
    [metricsCatalog, groupByKey]
  );

  const columns = useMemo(
    () =>
      buildMonthlyPerformanceColumns(
        groupByKey,
        displayColumns,
        groupByCatalogEntry?.display_name,
        groupByCatalogEntry?.description
      ),
    [groupByKey, displayColumns, groupByCatalogEntry]
  );

  const rowData = useMemo(
    () =>
      (response?.data ?? []).map((row) => ({
        ...row,
        id: String((row as Record<string, unknown>)[groupByKey] ?? ""),
      })),
    [response, groupByKey]
  );

  const showAlphaTypeSelect = useMemo(() => {
    const selectableDimensions =
      response?.metadata?.selectable_display_dimensions;
    if (selectableDimensions === null) return false;
    if (selectableDimensions !== undefined)
      return selectableDimensions.length > 1;
    return true;
  }, [response?.metadata?.selectable_display_dimensions]);

  const yearOptions = useMemo(
    () =>
      years.map((year) => ({
        label: year.toString(),
        value: year.toString(),
      })),
    []
  );

  const isGlobalLoading = isLoadingCatalog || isLoadingConfig;
  const isLoading = isLoadingData || isGlobalLoading;

  const handleYearChange = useCallback(
    (value: string | number | boolean) => {
      setLocalYear(value.toString());
    },
    [setLocalYear]
  );

  const handleAlphaTypeChange = useCallback(
    (value: string | number | boolean) => {
      setAlphaType(value as string);
    },
    []
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({ mode: isMaximized ? "normal" : "responsive" }),
    [isMaximized]
  );

  const getRowId = useCallback(
    (data: Record<string, unknown>) => String(data?.id ?? ""),
    []
  );

  const Actions = () => (
    <div className="flex gap-3 justify-end">
      <WidgetRefetchButton
        onRefetch={handleRefetch}
        isRefreshing={isLoadingData || isLoadingInvalidate}
      />
      {showAlphaTypeSelect && (
        <SkeletonWrapper
          isLoading={isGlobalLoading}
          skeletonClassName="w-[160px] h-9"
        >
          <TextSelect
            disablePortal
            virtual
            options={alphaTypeOptions}
            value={
              alphaType ?? response?.metadata?.selected_display_dimension ?? ""
            }
            placeholder="Alpha Type"
            onChange={handleAlphaTypeChange}
            testId="historical-monthly-alpha-perf-optimized-alpha-type-select"
          />
        </SkeletonWrapper>
      )}
      <SkeletonWrapper
        isLoading={isGlobalLoading}
        skeletonClassName="w-[128px] h-9"
      >
        <TextSelect
          disablePortal
          virtual
          options={benchmarkOptions}
          value={effectiveBenchmarkId}
          placeholder="Select Benchmark"
          onChange={handleSelectionChange("benchmarkId")}
          testId="historical-monthly-alpha-perf-optimized-benchmark-select"
        />
      </SkeletonWrapper>
      <SkeletonWrapper
        isLoading={isGlobalLoading}
        skeletonClassName="w-[128px] h-9"
      >
        <TextSelect
          disablePortal
          virtual
          options={yearOptions}
          value={selectedYear}
          placeholder="Select Year"
          onChange={handleYearChange}
        />
      </SkeletonWrapper>
      <SkeletonWrapper
        isLoading={isGlobalLoading}
        skeletonClassName="w-[128px] h-9"
      >
        <TextSelect
          disablePortal
          virtual
          options={groupByOptions}
          value={selection.groupBy}
          placeholder="Aggregate By"
          onChange={handleSelectionChange("groupBy")}
          testId="historical-monthly-alpha-perf-optimized-group-by-select"
        />
      </SkeletonWrapper>
    </div>
  );

  return (
    <WidgetWrapper data-testid="historical-monthly-alpha-perf-optimized-widget">
      <WidgetHeader>
        <WidgetTitle
          {...{
            exportToCSV: (name) => exportDatagridToCSV(gridRef, name),
          }}
        >
          Monthly Alpha Performance
        </WidgetTitle>
        <WidgetActions>
          {!isMobile && <Actions />}
          <WidgetMaximizeButton id="historical-monthly-alpha-perf-optimized-maximize-button" />
        </WidgetActions>
      </WidgetHeader>

      {isMobile && <Actions />}

      <FilterController
        id="historical-monthly-alpha-perf-optimized-filter-controller"
        filterOptions={filterOptions}
        selectedFilters={filters}
        setSelectedFilters={setFilters}
        isLoadingMetricsCatalog={isGlobalLoading}
        defaultFilters={defaultFilters}
        disableSubFilterPortal
        testId="historical-monthly-alpha-perf-optimized-filter-controller"
      />

      <WidgetBody data-testid="historical-monthly-alpha-perf-optimized-table-body">
        <DataGrid
          gridRef={gridRef}
          layout={dataGridLayout}
          loading={isLoading}
          rowData={rowData}
          columnDefs={columns}
          getRowId={getRowId}
          autoSizeStrategy={autoSizeStrategy}
          {...defaultGridProps}
        />
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const HistoricalMonthlyAlphaPerfOptimized = withAppInsights(
  HistoricalMonthlyAlphaPerfOptimizedContent,
  "HistoricalMonthlyAlphaPerfOptimized"
);
