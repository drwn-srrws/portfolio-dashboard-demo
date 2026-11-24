import { useCallback, useMemo } from "react";

import { MetricMetadata } from "@/api/types";
import FilterController from "@/components/FilterController/FilterController";
import { getFilterOptions } from "@/components/FilterController/utils";
import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { usePanelDateRange } from "@/hooks/usePanelDateRange";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { useOptimizedDateRange } from "@/providers/OptimizedDateRangeProvider";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { omitBy } from "@/utils/omit";
import { compactDateRangeRequest } from "@/utils/dateRange";
import { DataGrid, DataGridLayout } from "@components/Datagrid/index";
import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import {
  createColumnsFromMetadata,
  createGroupByColumn,
  defaultDataGridProps,
} from "./AlphaAnalysisTable.columns";
import {
  AlphaAnalysisRow,
  transformAlphaAnalysisResponse,
} from "./AlphaAnalysisTable.utils";

import { TextSelect } from "@/components/TextSelect";
import { useIsMobile } from "@/hooks/useMobile";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import { SkeletonWrapper } from "@components/SkeletonWrapper/SkeletonWrapper";
import { useSelection } from "@hooks/useSelection";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";
import {
  useGetAlphaAnalysisConfigEndpoint,
  useGetAlphaAnalysisStats,
  useGetPortfolioMetricsCatalog,
} from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import {
  AlphaAnalysisRequest,
  AlphaAnalysisRequestGroupByAnyOfItem,
  CommonFilters,
  GetAlphaAnalysisStats200,
} from "@/api/types";
import type { DateRangeRequest } from "@/api/aliases";

const getRowId = (data: AlphaAnalysisRow) => data.uniqueIds.join("-");

export interface AlphaAnalysisSelection {
  groupBy: string;
  benchmarkId: string;
}

export interface AlphaAnalysisTableProps {
  defaultBenchmarkId: string;
  title?: string;
  fixedGroupBy?: string;
  alignDataLeft?: boolean;
}

const groupByMetrics = [
  "fund_name",
  "primary_analyst",
  "secondary_analyst",
  "company_subsector",
  "portfolio_team",
  "market_cap",
];

const defaultGroupByMetric = "fund_name";

const FUND_NAME_BENCHMARKS = ["XBI US Equity", "NBI Index", "RGUSHSBT Index"];

const AlphaAnalysisContent = ({
  defaultBenchmarkId,
  title = "Alpha Analysis",
  fixedGroupBy,
  alignDataLeft = false,
}: AlphaAnalysisTableProps) => {
  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags } = useMetricFlags();
  const { isMaximized } = usePanelMaximize();
  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();
  const { requestDateRange } = useOptimizedDateRange();
  const isMobile = useIsMobile();

  const { selection, handleSelectionChange } =
    useSelection<AlphaAnalysisSelection>({
      groupBy: fixedGroupBy ?? defaultGroupByMetric,
      benchmarkId: defaultBenchmarkId,
    });

  const { data: pmCatalogData, isLoading: isLoadingCatalog } =
    useGetPortfolioMetricsCatalog();

  const { data: alphaAnalysisConfig, isLoading: isLoadingAlphaConfig } =
    useGetAlphaAnalysisConfigEndpoint();

  const { data: filterCatalogData, isLoading: isLoadingFilterCatalog } =
    useGetPortfolioMetricCatalogV3({
      ...metricFlags,
      include_filterable_values: true,
    });

  const metricsCatalog = useMemo(
    () => pmCatalogData?.metrics || [],
    [pmCatalogData]
  );

  const filterOptions = useMemo(() => {
    return getFilterOptions(filterCatalogData as MetricMetadata);
  }, [filterCatalogData]);

  const effectiveDateRange: DateRangeRequest = useMemo(() => {
    if (panelStartDate || panelEndDate) {
      return compactDateRangeRequest({
        start_date: panelStartDate,
        end_date: panelEndDate,
      });
    }
    return compactDateRangeRequest(requestDateRange);
  }, [panelEndDate, panelStartDate, requestDateRange]);

  const requestBody: AlphaAnalysisRequest = useMemo(() => {
    const cleanedFilters = omitBy(
      { ...filters, ...sharedFilters },
      (item) => !item.length
    );

    const benchmarkIds =
      selection.groupBy === "fund_name"
        ? FUND_NAME_BENCHMARKS
        : [selection.benchmarkId];

    return {
      date_range: {
        ...compactDateRangeRequest(effectiveDateRange),
      },
      filters: cleanedFilters as CommonFilters,
      benchmark_ids: benchmarkIds,
      group_by: [selection.groupBy as AlphaAnalysisRequestGroupByAnyOfItem],
    };
  }, [
    effectiveDateRange,
    filters,
    sharedFilters,
    selection.benchmarkId,
    selection.groupBy,
  ]);

  const { isFetching: isLoadingInvalidate, refetch: invalidateCache } =
    useGetAlphaAnalysisStats(
      requestBody,
      { ...metricFlags, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const {
    data,
    isLoading: isLoadingAlphaAnalysis,
    refetch: refetchAlphaAnalysis,
  } = useGetAlphaAnalysisStats(requestBody, metricFlags, {
    query: { enabled: true },
  });

  const rows = useMemo(() => {
    if (!data) return [];
    const responses = Array.isArray(data) ? data : [data];
    return transformAlphaAnalysisResponse(responses);
  }, [data]);

  const alphaResponse = useMemo((): GetAlphaAnalysisStats200 | undefined => {
    if (!data) return undefined;
    return Array.isArray(data)
      ? (data as GetAlphaAnalysisStats200[])[0]
      : (data as unknown as GetAlphaAnalysisStats200);
  }, [data]);

  const columns = useMemo(() => {
    const displayColumns = alphaResponse?.metadata?.display_columns ?? [];
    const groupByField =
      (alphaResponse?.metadata?.group_by as string[] | null)?.[0] ??
      selection.groupBy;

    const selectedGroupByMetric = metricsCatalog.find(
      (m) => m.name === groupByField
    );
    const groupByColumn = createGroupByColumn(
      selectedGroupByMetric?.display_name ?? groupByField,
      selectedGroupByMetric?.description ?? undefined,
      groupByField
    );

    const metricColumns = createColumnsFromMetadata(
      displayColumns,
      groupByField,
      metricsCatalog,
      alignDataLeft
    );

    return [groupByColumn, ...metricColumns];
  }, [alphaResponse, metricsCatalog, selection.groupBy, alignDataLeft]);

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({
      mode: isMaximized ? "normal" : "responsive",
    }),
    [isMaximized]
  );

  const groupByOptions = useMemo(
    () =>
      groupByMetrics.map((metric) => ({
        label:
          metricsCatalog.find((m) => m.name === metric)?.display_name ?? metric,
        value: metric,
      })),
    [metricsCatalog]
  );

  const benchmarkOptions = useMemo(() => {
    const benchmarks = alphaAnalysisConfig?.benchmarks ?? {};
    return Object.entries(benchmarks).map(([id, name]) => ({
      label: name,
      value: id,
    }));
  }, [alphaAnalysisConfig?.benchmarks]);

  const handleRefetch = useCallback(async () => {
    await invalidateCache();
    await refetchAlphaAnalysis();
  }, [invalidateCache, refetchAlphaAnalysis]);

  const Actions = () => (
    <div className="flex gap-3 flex-wrap">
      <WidgetRefetchButton
        onRefetch={handleRefetch}
        isRefreshing={
          isLoadingInvalidate || isLoadingAlphaAnalysis || isLoadingCatalog
        }
      />
      {selection.groupBy !== "fund_name" && (
        <SkeletonWrapper
          isLoading={isLoadingAlphaConfig}
          skeletonClassName="w-[128px] h-9"
        >
          <TextSelect
            disablePortal
            virtual
            options={benchmarkOptions}
            value={selection.benchmarkId}
            placeholder="Select Benchmark"
            onChange={handleSelectionChange("benchmarkId")}
            testId="alpha-analysis-benchmark-select"
          />
        </SkeletonWrapper>
      )}
      {!fixedGroupBy && (
        <SkeletonWrapper
          isLoading={isLoadingCatalog}
          skeletonClassName="w-[128px] h-9"
        >
          <TextSelect
            disablePortal
            virtual
            options={groupByOptions}
            value={selection.groupBy}
            placeholder="Aggregate By"
            onChange={handleSelectionChange("groupBy")}
            testId="alpha-analysis-group-by-select"
          />
        </SkeletonWrapper>
      )}
    </div>
  );

  return (
    <WidgetWrapper>
      <WidgetHeader>
        <WidgetTitle>{title}</WidgetTitle>
        <WidgetActions>
          {!isMobile && <Actions />}
          <WidgetMaximizeButton id="alpha-analysis-maximize-button" />
        </WidgetActions>
      </WidgetHeader>

      {isMobile && <Actions />}

      <FilterController
        id="alpha-analysis-filter-controller"
        filterOptions={filterOptions}
        selectedFilters={filters}
        setSelectedFilters={setFilters}
        isLoadingMetricsCatalog={isLoadingFilterCatalog}
        testId="alpha-analysis-filter-controller"
        disableSubFilterPortal
      />

      <WidgetBody data-testid="alpha-analysis-table-body">
        <div className="border-top-no-radius winners-losers-table-ag-grid alpha-analysis-table flex size-full flex-col">
          <DataGrid
            layout={dataGridLayout}
            rowData={rows}
            columnDefs={columns}
            getRowId={getRowId}
            loading={isLoadingAlphaAnalysis || isLoadingCatalog}
            rowSelection="multiple"
            tooltipShowDelay={0}
            tooltipHideDelay={600000}
            {...defaultDataGridProps}
          />
        </div>
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const AlphaAnalysis = withAppInsights(
  AlphaAnalysisContent,
  "AlphaAnalysisWidget"
);
