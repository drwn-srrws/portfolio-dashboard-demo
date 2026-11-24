import { useCallback, useMemo, useRef, useState } from "react";

import { GridApi } from "@ag-grid-community/core";

import { useGetPnlBySubteamStatsEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import type {
  CommonFilters,
  MetricMetadata,
  PnlBySubteamRequest,
} from "@/api/types";
import type { DateRangeRequest } from "@/api/aliases";
import FilterController from "@/components/FilterController/FilterController";
import { getFilterOptions } from "@/components/FilterController/utils";
import { DataGrid, DataGridLayout } from "@components/Datagrid/Datagrid";
import { exportDatagridToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import { TextSelect } from "@/components/TextSelect";
import { SkeletonWrapper } from "@components/SkeletonWrapper/SkeletonWrapper";
import { CardDateRange } from "@/components/Toolbar/components/CardDateRange";
import { WidgetActions } from "@/components/Widget/WidgetActions";
import { WidgetBody } from "@/components/Widget/WidgetBody";
import { WidgetHeader } from "@/components/Widget/WidgetHeader";
import WidgetMaximizeButton from "@/components/Widget/WidgetMaximizeButton";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";
import { WidgetTitle } from "@/components/Widget/WidgetTitle";
import { WidgetWrapper } from "@/components/Widget/WidgetWrapper";
import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { useIsMobile } from "@/hooks/useMobile";
import { usePanelDateRange } from "@/hooks/usePanelDateRange";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import { useSelection } from "@/hooks/useSelection";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { withAppInsights } from "@/modules/app-insights/hocs/withAppInsights";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { compactDateRangeRequest } from "@/utils/dateRange";
import { omitBy } from "@/utils/omit";

import { usePnlBySubteamConfig } from "./hooks";
import {
  createPnlBySubteamColumns,
  defaultDataGridProps,
} from "./PnlBySubteamTable.columns";
import {
  DEFAULT_BENCHMARK_ID,
  PnlBySubteamTableRow,
  transformPnlBySubteamResponse,
} from "./PnlBySubteamTable.utils";

interface PnlBySubteamSelection {
  benchmarkId: string;
}

export interface PnlBySubteamTableProps {
  defaultBenchmarkId?: string;
}

const getRowId = (data: PnlBySubteamTableRow) => data.uniqueId;

const PnlBySubteamTableContent = ({
  defaultBenchmarkId = DEFAULT_BENCHMARK_ID,
}: PnlBySubteamTableProps) => {
  const gridRef = useRef<GridApi | null>(null);
  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags } = useMetricFlags();
  const { isMaximized } = usePanelMaximize();
  const isMobile = useIsMobile();

  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();

  const [localDatePeriod, setLocalDatePeriod] = useState("YTD");
  const [localCustomStartDate, setLocalCustomStartDate] = useState<
    string | undefined
  >();
  const [localCustomEndDate, setLocalCustomEndDate] = useState<
    string | undefined
  >();

  const { config, isLoading: isLoadingConfig } = usePnlBySubteamConfig();

  const effectiveDateRange: DateRangeRequest = useMemo(() => {
    if (panelStartDate || panelEndDate) {
      return compactDateRangeRequest({
        start_date: panelStartDate,
        end_date: panelEndDate,
      });
    }
    if (localDatePeriod === "CUSTOM") {
      return compactDateRangeRequest({
        start_date: localCustomStartDate,
        end_date: localCustomEndDate,
      });
    }
    return {
      period: localDatePeriod as import("@/api/types").DateRangeRequestPeriod,
    };
  }, [
    panelStartDate,
    panelEndDate,
    localDatePeriod,
    localCustomStartDate,
    localCustomEndDate,
  ]);

  const handleCustomDateChange = useCallback((start?: string, end?: string) => {
    setLocalCustomStartDate(start);
    setLocalCustomEndDate(end);
  }, []);

  const { selection, handleSelectionChange } =
    useSelection<PnlBySubteamSelection>({
      benchmarkId: defaultBenchmarkId,
    });

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

  const benchmarkOptions = useMemo(() => {
    return Object.entries(config.benchmarks).map(([id, name]) => ({
      label: name,
      value: id,
    }));
  }, [config.benchmarks]);

  const requestBody: PnlBySubteamRequest = useMemo(() => {
    const cleanedFilters = omitBy(
      { ...filters, ...sharedFilters },
      (item) => !item.length
    ) as CommonFilters;

    return {
      date_range: { ...compactDateRangeRequest(effectiveDateRange) },
      filters: cleanedFilters,
      benchmark_id: selection.benchmarkId,
    };
  }, [effectiveDateRange, filters, sharedFilters, selection.benchmarkId]);

  const isDataEnabled =
    !!effectiveDateRange.period ||
    (!!effectiveDateRange.start_date && !!effectiveDateRange.end_date);

  const queryParams = useMemo(
    () => ({ explode_composites: metricFlags.explode_composites }),
    [metricFlags.explode_composites]
  );

  const { refetch: invalidateCache } = useGetPnlBySubteamStatsEndpoint(
    requestBody,
    { ...queryParams, invalidate_cache: true },
    { query: { enabled: false } }
  );

  const {
    data: response,
    isLoading,
    isFetching,
    refetch: refetchQuery,
  } = useGetPnlBySubteamStatsEndpoint(requestBody, queryParams, {
    query: { enabled: isDataEnabled },
  });

  const rows = useMemo(() => {
    if (!response?.data) return [];
    return transformPnlBySubteamResponse(response.data, selection.benchmarkId);
  }, [response, selection.benchmarkId]);

  const catalogMap = useMemo(
    () =>
      Object.fromEntries(
        (filterCatalogData?.metrics ?? []).map((m) => [
          m.name,
          { display_name: m.display_name, description: m.description },
        ])
      ),
    [filterCatalogData]
  );

  const columns = useMemo(
    () =>
      createPnlBySubteamColumns(
        `Alpha (vs ${selection.benchmarkId})`,
        catalogMap
      ),
    [selection.benchmarkId, catalogMap]
  );

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({ mode: isMaximized ? "normal" : "responsive" }),
    [isMaximized]
  );

  const handleRefetch = useCallback(async () => {
    await invalidateCache();
    await refetchQuery();
  }, [invalidateCache, refetchQuery]);

  const isGlobalLoading = isLoadingConfig || isLoadingFilterCatalog;

  const Actions = () => (
    <div className="flex flex-wrap gap-3">
      <WidgetRefetchButton
        onRefetch={handleRefetch}
        isRefreshing={isLoading || isFetching || isGlobalLoading}
      />
      <SkeletonWrapper
        isLoading={isGlobalLoading}
        skeletonClassName="w-[128px] h-9"
      >
        <TextSelect
          disablePortal
          virtual
          options={benchmarkOptions}
          value={selection.benchmarkId}
          placeholder="Select Benchmark"
          onChange={handleSelectionChange("benchmarkId")}
          testId="pnl-by-subteam-benchmark-select"
        />
      </SkeletonWrapper>
    </div>
  );

  return (
    <WidgetWrapper>
      <WidgetHeader>
        <WidgetTitle
          exportToCSV={(name: string) => exportDatagridToCSV(gridRef, name)}
        >
          PnL by Subteam
        </WidgetTitle>
        <WidgetActions>
          {!isMobile && <Actions />}
          <WidgetMaximizeButton id="pnl-by-subteam-maximize-button" />
        </WidgetActions>
      </WidgetHeader>

      {isMobile && <Actions />}

      <CardDateRange
        period={localDatePeriod}
        startDate={localCustomStartDate}
        endDate={localCustomEndDate}
        onPeriodChange={setLocalDatePeriod}
        onCustomDateChange={handleCustomDateChange}
      />

      <FilterController
        id="pnl-by-subteam-filter-controller"
        filterOptions={filterOptions}
        selectedFilters={filters}
        setSelectedFilters={setFilters}
        isLoadingMetricsCatalog={isLoadingFilterCatalog || isLoadingConfig}
        testId="pnl-by-subteam-filter-controller"
        disableSubFilterPortal
      />

      <WidgetBody data-testid="pnl-by-subteam-table-body">
        <div className="flex size-full flex-col">
          <DataGrid
            gridRef={gridRef}
            layout={dataGridLayout}
            rowData={rows}
            columnDefs={columns}
            loading={isLoading || isGlobalLoading}
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

export const PnlBySubteamTable = withAppInsights(
  PnlBySubteamTableContent,
  "PnlBySubteamTable"
);
