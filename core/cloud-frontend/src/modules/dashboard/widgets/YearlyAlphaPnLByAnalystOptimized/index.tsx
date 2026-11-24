import { useCallback, useMemo, useRef } from "react";

import { GridApi } from "@ag-grid-community/core";

import type { CommonFilters, MetricMetadata } from "@/api/types";
import FilterController from "@/components/FilterController/FilterController";
import { getFilterOptions } from "@/components/FilterController/utils";
import { DataGrid, DataGridLayout } from "@components/Datagrid/Datagrid";
import { exportDatagridToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import { TextSelect } from "@/components/TextSelect";
import { SkeletonWrapper } from "@components/SkeletonWrapper/SkeletonWrapper";
import { WidgetActions } from "@/components/Widget/WidgetActions";
import { WidgetBody } from "@/components/Widget/WidgetBody";
import { WidgetHeader } from "@/components/Widget/WidgetHeader";
import WidgetMaximizeButton from "@/components/Widget/WidgetMaximizeButton";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";
import { WidgetTitle } from "@/components/Widget/WidgetTitle";
import { WidgetWrapper } from "@/components/Widget/WidgetWrapper";
import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { useIsMobile } from "@/hooks/useMobile";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import { useSelection } from "@/hooks/useSelection";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { withAppInsights } from "@/modules/app-insights/hocs/withAppInsights";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { omitBy } from "@/utils/omit";

import {
  useYearlyAlphaPnLByAnalystConfig,
  useYearlyAlphaPnLByAnalystData,
} from "./hooks";
import {
  createYearlyAlphaPnLByAnalystColumns,
  defaultDataGridProps,
} from "./YearlyAlphaPnLByAnalystTable.columns";
import {
  transformYearlyAlphaPnLByAnalystResponse,
  type YearlyAlphaPnLByAnalystTableRow,
} from "./YearlyAlphaPnLByAnalystTable.utils";

interface YearlyAlphaPnLByAnalystSelection {
  benchmarkId: string;
}

export interface YearlyAlphaPnLByAnalystOptimizedProps {
  /** Hardcoded scope filters (e.g., {portfolio_team: ["Medical Technology"], fund_name: ["Flagship"]}). */
  defaultFilters: Record<string, string[]>;
  /** Card title shown in the widget header. */
  title: string;
  /** Optional override for the default benchmark; otherwise pulled from the matched FilterBenchmarkCombo. */
  defaultBenchmarkIdOverride?: string;
  /** Optional test-id prefix for the rendered widget. */
  testIdPrefix?: string;
}

const getRowId = (data: YearlyAlphaPnLByAnalystTableRow) => data.uniqueId;

const YearlyAlphaPnLByAnalystOptimizedContent = ({
  defaultFilters,
  title,
  defaultBenchmarkIdOverride,
  testIdPrefix = "yearly-alpha-pnl-by-analyst",
}: YearlyAlphaPnLByAnalystOptimizedProps) => {
  const gridRef = useRef<GridApi | null>(null);
  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags } = useMetricFlags();
  const { isMaximized } = usePanelMaximize();
  const isMobile = useIsMobile();

  const { config, isLoading: isLoadingConfig } =
    useYearlyAlphaPnLByAnalystConfig(defaultFilters);

  const { data: filterCatalogData, isLoading: isLoadingFilterCatalog } =
    useGetPortfolioMetricCatalogV3({
      ...metricFlags,
      include_filterable_values: true,
    });

  const filterOptions = useMemo(
    () =>
      getFilterOptions(
        filterCatalogData as MetricMetadata,
        config.supportedFilters
      ),
    [filterCatalogData, config.supportedFilters]
  );

  const initialBenchmarkId =
    defaultBenchmarkIdOverride ?? config.defaultBenchmarkId ?? "";

  const { selection, handleSelectionChange } =
    useSelection<YearlyAlphaPnLByAnalystSelection>({
      benchmarkId: initialBenchmarkId,
    });

  const activeBenchmarkId = selection.benchmarkId || initialBenchmarkId;

  const benchmarkOptions = useMemo(() => {
    return Object.entries(config.benchmarks).map(([id, name]) => ({
      label: name,
      value: id,
    }));
  }, [config.benchmarks]);

  const effectiveFilters = useMemo<CommonFilters>(() => {
    return omitBy(
      { ...defaultFilters, ...sharedFilters },
      (item) => !item.length
    ) as CommonFilters;
  }, [defaultFilters, sharedFilters]);

  const {
    response,
    isLoading: isLoadingData,
    isFetching,
    isLoadingInvalidate,
    refetch,
  } = useYearlyAlphaPnLByAnalystData({
    benchmarkId: activeBenchmarkId || null,
    filters: effectiveFilters,
    enabled: !!activeBenchmarkId,
  });

  const displayColumns = useMemo(
    () => response?.metadata?.display_columns ?? [],
    [response]
  );

  const rows = useMemo(() => {
    if (!response?.data) return [];
    return transformYearlyAlphaPnLByAnalystResponse(
      response.data,
      activeBenchmarkId
    );
  }, [response, activeBenchmarkId]);

  const columns = useMemo(
    () => createYearlyAlphaPnLByAnalystColumns(displayColumns),
    [displayColumns]
  );

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({ mode: isMaximized ? "normal" : "responsive" }),
    [isMaximized]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const isGlobalLoading = isLoadingConfig;
  const isLoading = isLoadingData || isGlobalLoading;

  const Actions = () => (
    <div className="flex flex-wrap gap-3">
      <WidgetRefetchButton
        onRefetch={handleRefetch}
        isRefreshing={isLoadingData || isFetching || isLoadingInvalidate}
      />
      <SkeletonWrapper
        isLoading={isGlobalLoading}
        skeletonClassName="w-[128px] h-9"
      >
        <TextSelect
          disablePortal
          virtual
          options={benchmarkOptions}
          value={activeBenchmarkId}
          placeholder="Select Benchmark"
          onChange={handleSelectionChange("benchmarkId")}
          testId={`${testIdPrefix}-benchmark-select`}
        />
      </SkeletonWrapper>
    </div>
  );

  return (
    <WidgetWrapper testId={`${testIdPrefix}-widget`}>
      <WidgetHeader>
        <WidgetTitle
          exportToCSV={(name: string) => exportDatagridToCSV(gridRef, name)}
        >
          {title}
        </WidgetTitle>
        <WidgetActions>
          {!isMobile && <Actions />}
          <WidgetMaximizeButton id={`${testIdPrefix}-maximize-button`} />
        </WidgetActions>
      </WidgetHeader>

      {isMobile && <Actions />}

      <FilterController
        id={`${testIdPrefix}-filter-controller`}
        filterOptions={filterOptions}
        selectedFilters={filters}
        setSelectedFilters={setFilters}
        isLoadingMetricsCatalog={isLoadingFilterCatalog || isLoadingConfig}
        testId={`${testIdPrefix}-filter-controller`}
        defaultFilters={defaultFilters}
        disableSubFilterPortal
      />

      <WidgetBody data-testid={`${testIdPrefix}-table-body`}>
        <div className="flex size-full flex-col">
          <DataGrid
            gridRef={gridRef}
            layout={dataGridLayout}
            rowData={rows}
            columnDefs={columns}
            loading={isLoading}
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

export const YearlyAlphaPnLByAnalystOptimized = withAppInsights(
  YearlyAlphaPnLByAnalystOptimizedContent,
  "YearlyAlphaPnLByAnalystOptimized"
);
