import { useCallback, useMemo, useRef } from "react";

import { GridApi, RowClassParams } from "@ag-grid-community/core";

import { useGetPnlByNewCompaniesCompanyStats } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import type {
  CommonFilters,
  MetricMetadata,
  PnlByNewCompaniesCompanyRequest,
} from "@/api/types";
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

import { usePnlByNewCompaniesCompanyViewConfig } from "./hooks";
import {
  createPnlByNewCompaniesCompanyViewColumns,
  defaultDataGridProps,
} from "./PnlByNewCompaniesCompanyViewTable.columns";
import {
  buildPnlByNewCompaniesCompanyTotalRow,
  DEFAULT_FUND_NAME,
  transformPnlByNewCompaniesCompanyViewResponse,
  type PnlByNewCompaniesCompanyViewTableRow,
} from "./PnlByNewCompaniesCompanyViewTable.utils";

interface PnlByNewCompaniesCompanyViewSelection {
  fundName: string;
}

export interface PnlByNewCompaniesCompanyViewTableProps {
  defaultFundName?: string;
}

const getRowId = (data: PnlByNewCompaniesCompanyViewTableRow) => data.uniqueId;

const getRowStyle = (params: RowClassParams) =>
  params.node.rowPinned === "bottom"
    ? {
        fontWeight: 600,
        borderTop: "1px solid var(--ag-border-color, #d4d4d8)",
      }
    : undefined;

const PnlByNewCompaniesCompanyViewTableContent = ({
  defaultFundName = DEFAULT_FUND_NAME,
}: PnlByNewCompaniesCompanyViewTableProps) => {
  const gridRef = useRef<GridApi | null>(null);
  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags } = useMetricFlags();
  const { isMaximized } = usePanelMaximize();
  const isMobile = useIsMobile();

  // Card is always ITD (reference AC): does NOT respect the page-level
  // date range filter. We intentionally do not call usePanelDateRange /
  // useOptimizedDateRange here and do not send `date_range` in the
  // request body — backend defaults to ITD when omitted.

  const { config, isLoading: isLoadingConfig } =
    usePnlByNewCompaniesCompanyViewConfig();

  const { selection, handleSelectionChange } =
    useSelection<PnlByNewCompaniesCompanyViewSelection>({
      fundName: defaultFundName,
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

  const fundOptions = useMemo(() => {
    const fundFilter = filterCatalogData?.filterable_by?.find(
      (f) => f.name === "fund_name"
    );
    const values = fundFilter?.filterable_values ?? [];
    return values
      .filter((v): v is string => typeof v === "string")
      .map((v) => ({ label: v, value: v }));
  }, [filterCatalogData?.filterable_by]);

  const cleanedFilters = useMemo(
    () =>
      // Local + shared filters; the Fund dropdown writes to `fund_name`
      // and takes precedence over whatever the FilterController set.
      omitBy(
        { ...filters, ...sharedFilters, fund_name: [selection.fundName] },
        (item) => !item.length
      ) as CommonFilters,
    [filters, sharedFilters, selection.fundName]
  );

  const request: PnlByNewCompaniesCompanyRequest = useMemo(
    () => ({ filters: cleanedFilters }),
    [cleanedFilters]
  );

  const queryParams = useMemo(
    () => ({ explode_composites: metricFlags.explode_composites }),
    [metricFlags.explode_composites]
  );

  const isDataEnabled = !!selection.fundName;

  const { refetch: invalidateCache } = useGetPnlByNewCompaniesCompanyStats(
    request,
    { ...queryParams, invalidate_cache: true },
    { query: { enabled: false } }
  );

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetPnlByNewCompaniesCompanyStats(request, queryParams, {
    query: { enabled: isDataEnabled },
  });

  const scopeKey = selection.fundName;

  const rows = useMemo(() => {
    if (!response?.data) return [];
    return transformPnlByNewCompaniesCompanyViewResponse(
      response.data,
      scopeKey
    );
  }, [response, scopeKey]);

  const totalRow = useMemo(
    () => buildPnlByNewCompaniesCompanyTotalRow(response?.totals, scopeKey),
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
    () => createPnlByNewCompaniesCompanyViewColumns(catalogMap),
    [catalogMap]
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
      <SkeletonWrapper
        isLoading={isGlobalLoading || isLoadingFilterCatalog}
        skeletonClassName="w-[128px] h-9"
      >
        <TextSelect
          disablePortal
          virtual
          options={fundOptions}
          value={selection.fundName}
          placeholder="Select Fund"
          onChange={handleSelectionChange("fundName")}
          testId="pnl-by-new-companies-company-view-fund-select"
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
          PnL by New Companies (Company View) - ITD
        </WidgetTitle>
        <WidgetActions>
          {!isMobile && <Actions />}
          <WidgetMaximizeButton id="pnl-by-new-companies-company-view-maximize-button" />
        </WidgetActions>
      </WidgetHeader>

      {isMobile && <Actions />}

      <FilterController
        id="pnl-by-new-companies-company-view-filter-controller"
        filterOptions={filterOptions}
        selectedFilters={filters}
        setSelectedFilters={setFilters}
        isLoadingMetricsCatalog={isLoadingFilterCatalog || isLoadingConfig}
        testId="pnl-by-new-companies-company-view-filter-controller"
        disableSubFilterPortal
      />

      <WidgetBody data-testid="pnl-by-new-companies-company-view-table-body">
        <div className="flex size-full flex-col">
          <DataGrid
            gridRef={gridRef}
            layout={dataGridLayout}
            rowData={rows}
            columnDefs={columns}
            loading={isLoading || isGlobalLoading}
            getRowId={getRowId}
            getRowStyle={getRowStyle}
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

export const PnlByNewCompaniesCompanyViewTable = withAppInsights(
  PnlByNewCompaniesCompanyViewTableContent,
  "PnlByNewCompaniesCompanyViewTable"
);
