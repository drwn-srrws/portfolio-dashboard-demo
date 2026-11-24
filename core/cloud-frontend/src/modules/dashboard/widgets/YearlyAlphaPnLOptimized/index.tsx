import { useCallback, useMemo, useRef, useState } from "react";
import { GridApi } from "@ag-grid-community/core";

import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { MetricMetadata } from "@api/types/index";
import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { DataGrid, DataGridLayout } from "@components/Datagrid/Datagrid";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import FilterController from "@/components/FilterController/FilterController";
import { Filters } from "@/typings/Filters";
import { MetricDisplayType } from "@/api/types";
import { TextSelect } from "@/components/TextSelect";
import { SkeletonWrapper } from "@components/SkeletonWrapper/SkeletonWrapper";

import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import { getFilterOptions } from "@/components/FilterController/utils";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { exportDatagridToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";
import { hyphenatedDate } from "@/utils/dates";
import type { DateRangeRequest } from "@/api/aliases";
import { compactDateRangeRequest } from "@/utils/dateRange";

import { useYearlyAlphaPnLConfig, useYearlyAlphaPnLData } from "./hooks";
import {
  createYearlyAlphaPnLOptimizedColumns,
  autoSizeStrategy,
  defaultGridProps,
} from "./utils";

const LTD_START_YEAR = 2021;

const getDefaultDateRange = () => {
  const now = new Date();
  const startDate = `${LTD_START_YEAR}-01-01`;
  const endDate = hyphenatedDate(now);
  return { startDate, endDate };
};

export interface YearlyAlphaPnLOptimizedProps {
  defaultFilters?: Filters;
  defaultBenchmarkIds?: string[];
}

const YearlyAlphaPnLOptimizedContent = ({
  defaultFilters,
  defaultBenchmarkIds,
}: YearlyAlphaPnLOptimizedProps) => {
  const gridRef = useRef<GridApi | null>(null);
  const [alphaType, setAlphaType] = useState<string | undefined>(undefined);

  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags } = useMetricFlags();
  const { isMaximized } = usePanelMaximize();

  const { config, isLoading: isLoadingConfig } = useYearlyAlphaPnLConfig();

  const { data: metricsCatalogData, isLoading: isLoadingCatalog } =
    useGetPortfolioMetricCatalogV3({
      ...metricFlags,
      include_filterable_values: true,
    });

  const filterOptions = useMemo(
    () =>
      getFilterOptions(
        metricsCatalogData as MetricMetadata,
        config.supportedFilters
      ),
    [metricsCatalogData, config.supportedFilters]
  );

  const combinedFilters = useMemo(
    () => ({ ...defaultFilters, ...sharedFilters }),
    [defaultFilters, sharedFilters]
  );

  const benchmarkIds = useMemo(() => {
    const portfolioTeam = combinedFilters.portfolio_team;
    const hasPortfolioTeamFilter = Array.isArray(portfolioTeam) && portfolioTeam.length > 0;
    if (
      hasPortfolioTeamFilter &&
      defaultBenchmarkIds &&
      defaultBenchmarkIds.length > 0
    ) {
      return defaultBenchmarkIds;
    }
    return config.benchmarkIds;
  }, [combinedFilters.portfolio_team, defaultBenchmarkIds, config.benchmarkIds]);

  const { startDate, endDate } = useMemo(() => {
    const defaults = getDefaultDateRange();
    return {
      startDate: config.dateRange?.start_date ?? defaults.startDate,
      endDate: config.dateRange?.end_date ?? defaults.endDate,
    };
  }, [config.dateRange]);

  const selectedMetric = alphaType;
  const effectiveDateRange: DateRangeRequest = useMemo(
    () => compactDateRangeRequest({ start_date: startDate, end_date: endDate }),
    [endDate, startDate]
  );

  const {
    response,
    isLoading: isLoadingData,
    isLoadingInvalidate,
    refetch,
  } = useYearlyAlphaPnLData({
    dateRange: effectiveDateRange,
    sharedFilters: combinedFilters as Filters,
    benchmarkIds,
    metric: selectedMetric,
    enabled: !!metricsCatalogData,
  });

  const displayColumns = useMemo(
    () => response?.metadata?.display_columns ?? [],
    [response]
  );

  const groupByColumns = useMemo(
    () => response?.metadata?.group_by ?? [],
    [response]
  );

  const metricsCatalog = useMemo(
    () => metricsCatalogData?.metrics || [],
    [metricsCatalogData]
  );

  const alphaTypeOptions = useMemo(
    () =>
      (response?.metadata?.selectable_display_dimensions ?? []).map((dim) => {
        const entry = metricsCatalog.find((m) => m.name === dim);
        return { label: entry?.display_name ?? dim, value: dim };
      }),
    [response?.metadata?.selectable_display_dimensions, metricsCatalog]
  );

  const metricDisplayType = useMemo(() => {
    const metricName = response?.metadata?.selected_display_dimension;
    if (metricName) {
      const catalogEntry = metricsCatalog.find((m) => m.name === metricName);
      if (catalogEntry?.display_type) return catalogEntry.display_type;
    }
    return MetricDisplayType.percent;
  }, [response?.metadata?.selected_display_dimension, metricsCatalog]);

  const metricDescription = useMemo(() => {
    const metricName = response?.metadata?.selected_display_dimension;
    if (metricName) {
      const catalogEntry = metricsCatalog.find((m) => m.name === metricName);
      return catalogEntry?.description || catalogEntry?.display_name;
    }
    return undefined;
  }, [response?.metadata?.selected_display_dimension, metricsCatalog]);

  const rows = useMemo(() => response?.data ?? [], [response]);

  const columns = useMemo(
    () =>
      createYearlyAlphaPnLOptimizedColumns(
        displayColumns,
        groupByColumns,
        metricDisplayType,
        metricDescription
      ),
    [displayColumns, groupByColumns, metricDisplayType, metricDescription]
  );

  const getRowId = useCallback(
    (row: Record<string, unknown>) => {
      for (const col of groupByColumns) {
        const val = row[col];
        if (val != null) return String(val);
      }
      const benchmarkId = row.benchmark_id;
      if (benchmarkId != null) return String(benchmarkId);
      return "total";
    },
    [groupByColumns]
  );

  const showAlphaTypeSelect = useMemo(() => {
    const selectableDimensions =
      response?.metadata?.selectable_display_dimensions;
    if (selectableDimensions === null) return false;
    if (selectableDimensions !== undefined)
      return selectableDimensions.length >= 1;
    return true;
  }, [response?.metadata?.selectable_display_dimensions]);

  const isGlobalLoading = isLoadingCatalog || isLoadingConfig;
  const isLoading = isLoadingData || isGlobalLoading;

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({ mode: isMaximized ? "normal" : "responsive" }),
    [isMaximized]
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

  return (
    <WidgetWrapper testId="yearly-alpha-pnl-optimized-widget">
      <WidgetHeader>
        <WidgetTitle
          {...{
            exportToCSV: (name) => exportDatagridToCSV(gridRef, name),
          }}
        >
          Yearly Alpha PnL
        </WidgetTitle>
        <WidgetActions>
          <WidgetRefetchButton
            onRefetch={handleRefetch}
            isRefreshing={isLoadingData || isLoadingInvalidate}
          />
          {showAlphaTypeSelect && (
            <SkeletonWrapper
              isLoading={isLoading}
              skeletonClassName="w-[160px] h-9"
            >
              <TextSelect
                disablePortal
                virtual
                options={alphaTypeOptions}
                value={
                  alphaType ??
                  response?.metadata?.selected_display_dimension ??
                  ""
                }
                placeholder="Alpha Type"
                onChange={handleAlphaTypeChange}
                testId="yearly-alpha-pnl-optimized-alpha-type-select"
              />
            </SkeletonWrapper>
          )}
          <WidgetMaximizeButton id="yearly-alpha-pnl-optimized-maximize-button" />
        </WidgetActions>
      </WidgetHeader>

      <FilterController
        id="yearly-alpha-pnl-optimized-filter-controller"
        filterOptions={filterOptions}
        selectedFilters={filters}
        setSelectedFilters={setFilters}
        isLoadingMetricsCatalog={isGlobalLoading}
        testId="yearly-alpha-pnl-optimized-filter-controller"
        defaultFilters={defaultFilters}
        disableSubFilterPortal
      />

      <WidgetBody data-testid="yearly-alpha-pnl-optimized-table-body">
        <div className="border-top-no-radius winners-losers-table-ag-grid flex size-full flex-col">
          <DataGrid
            gridRef={gridRef}
            layout={dataGridLayout}
            rowData={rows}
            columnDefs={columns}
            loading={isLoading}
            autoSizeStrategy={autoSizeStrategy}
            getRowId={getRowId}
            tooltipShowDelay={0}
            tooltipHideDelay={600000}
            {...defaultGridProps}
          />
        </div>
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const YearlyAlphaPnLOptimized = withAppInsights(
  YearlyAlphaPnLOptimizedContent,
  "YearlyAlphaPnLOptimized"
);
