import { useCallback, useMemo, useRef, useState } from "react";

import { GridApi, RowClassParams } from "@ag-grid-community/core";

import { useGetPnlByNewCompaniesAnalystStats } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import type {
  CommonFilters,
  MetricMetadata,
  PnlByNewCompaniesAnalystRequest,
} from "@/api/types";
import type { DateRangeRequest } from "@/api/aliases";
import FilterController from "@/components/FilterController/FilterController";
import { getFilterOptions } from "@/components/FilterController/utils";
import { DataGrid, DataGridLayout } from "@components/Datagrid/Datagrid";
import { exportDatagridToCSV } from "@/components/Datagrid/helpers/exportToCSV";
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
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { withAppInsights } from "@/modules/app-insights/hocs/withAppInsights";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { compactDateRangeRequest } from "@/utils/dateRange";
import { omitBy } from "@/utils/omit";

import { usePnlByNewCompaniesAnalystViewConfig } from "./hooks";
import {
  createPnlByNewCompaniesAnalystAutoGroupColumnDef,
  createPnlByNewCompaniesAnalystViewColumns,
  defaultDataGridProps,
} from "./PnlByNewCompaniesAnalystViewTable.columns";
import {
  buildPnlByNewCompaniesAnalystTotalRow,
  transformPnlByNewCompaniesAnalystViewResponse,
  type PnlByNewCompaniesAnalystViewTableRow,
} from "./PnlByNewCompaniesAnalystViewTable.utils";

export type PnlByNewCompaniesAnalystViewTableProps = Record<string, never>;

const getRowId = (data: PnlByNewCompaniesAnalystViewTableRow) =>
  data.uniqueIds.join("-");

const getDataPath = (data: PnlByNewCompaniesAnalystViewTableRow) =>
  data.uniqueIds;

const getRowStyle = (params: RowClassParams) =>
  params.node.rowPinned === "bottom"
    ? {
        fontWeight: 600,
        borderTop: "1px solid var(--ag-border-color, #d4d4d8)",
      }
    : undefined;

const PnlByNewCompaniesAnalystViewTableContent = () => {
  const gridRef = useRef<GridApi | null>(null);
  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags } = useMetricFlags();
  const { isMaximized } = usePanelMaximize();
  const isMobile = useIsMobile();

  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();

  const [localDatePeriod, setLocalDatePeriod] = useState("ITD");
  const [localCustomStartDate, setLocalCustomStartDate] = useState<
    string | undefined
  >();
  const [localCustomEndDate, setLocalCustomEndDate] = useState<
    string | undefined
  >();

  const { config, isLoading: isLoadingConfig } =
    usePnlByNewCompaniesAnalystViewConfig();

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

  const cleanedFilters = useMemo(
    () =>
      omitBy(
        { ...filters, ...sharedFilters },
        (item) => !item.length
      ) as CommonFilters,
    [filters, sharedFilters]
  );

  const request: PnlByNewCompaniesAnalystRequest = useMemo(
    () => ({
      date_range: { ...compactDateRangeRequest(effectiveDateRange) },
      filters: cleanedFilters,
    }),
    [effectiveDateRange, cleanedFilters]
  );

  const isDataEnabled =
    !!effectiveDateRange.period ||
    (!!effectiveDateRange.start_date && !!effectiveDateRange.end_date);

  const queryParams = useMemo(
    () => ({ explode_composites: metricFlags.explode_composites }),
    [metricFlags.explode_composites]
  );

  const { refetch: invalidateCache } = useGetPnlByNewCompaniesAnalystStats(
    request,
    { ...queryParams, invalidate_cache: true },
    { query: { enabled: false } }
  );

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetPnlByNewCompaniesAnalystStats(request, queryParams, {
    query: { enabled: isDataEnabled },
  });

  const scopeKey =
    effectiveDateRange.period ??
    `${effectiveDateRange.start_date ?? ""}_${effectiveDateRange.end_date ?? ""}`;

  const rows = useMemo(() => {
    if (!response?.[0]?.data) return [];
    return transformPnlByNewCompaniesAnalystViewResponse(
      response[0].data,
      response[1]?.data ?? [],
      scopeKey
    );
  }, [response, scopeKey]);

  const totalRow = useMemo(
    () =>
      buildPnlByNewCompaniesAnalystTotalRow(response?.[0]?.totals, scopeKey),
    [response, scopeKey]
  );

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
    () => createPnlByNewCompaniesAnalystViewColumns(catalogMap),
    [catalogMap]
  );

  const autoGroupColumnDef = useMemo(
    () => createPnlByNewCompaniesAnalystAutoGroupColumnDef(),
    []
  );

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({ mode: isMaximized ? "normal" : "responsive" }),
    [isMaximized]
  );

  const handleRefetch = useCallback(async () => {
    await invalidateCache();
    await refetch();
  }, [invalidateCache, refetch]);

  const isGlobalLoading = isLoadingConfig || isLoadingFilterCatalog;

  const Actions = () => (
    <div className="flex flex-wrap gap-3">
      <WidgetRefetchButton
        onRefetch={handleRefetch}
        isRefreshing={isLoading || isFetching || isGlobalLoading}
      />
    </div>
  );

  return (
    <WidgetWrapper>
      <WidgetHeader>
        <WidgetTitle
          exportToCSV={(name: string) => exportDatagridToCSV(gridRef, name)}
        >
          PnL by New Companies (Analyst View)
        </WidgetTitle>
        <WidgetActions>
          {!isMobile && <Actions />}
          <WidgetMaximizeButton id="pnl-by-new-companies-analyst-view-maximize-button" />
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
        id="pnl-by-new-companies-analyst-view-filter-controller"
        filterOptions={filterOptions}
        selectedFilters={filters}
        setSelectedFilters={setFilters}
        isLoadingMetricsCatalog={isLoadingFilterCatalog || isLoadingConfig}
        testId="pnl-by-new-companies-analyst-view-filter-controller"
        disableSubFilterPortal
      />

      <WidgetBody data-testid="pnl-by-new-companies-analyst-view-table-body">
        <div className="flex size-full flex-col">
          <DataGrid
            gridRef={gridRef}
            layout={dataGridLayout}
            rowData={rows}
            columnDefs={columns}
            loading={isLoading || isGlobalLoading}
            getRowId={getRowId}
            getDataPath={getDataPath}
            getRowStyle={getRowStyle}
            autoGroupColumnDef={autoGroupColumnDef}
            pinnedBottomRowData={totalRow}
            tooltipShowDelay={0}
            tooltipHideDelay={600000}
            {...defaultDataGridProps}
          />
        </div>
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const PnlByNewCompaniesAnalystViewTable = withAppInsights(
  PnlByNewCompaniesAnalystViewTableContent,
  "PnlByNewCompaniesAnalystViewTable"
);
