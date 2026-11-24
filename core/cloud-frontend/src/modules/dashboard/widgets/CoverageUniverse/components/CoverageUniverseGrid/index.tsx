import { useMemo, useCallback } from "react";
import {
  CompanyResponse as Company,
  MetricCatalogItem,
  MetricDisplayType,
} from "@api/types";
import { Sort } from "@typings/Sort";

import { Column } from "../../types/Column";
import {
  CompanyRow,
  mapCompaniesToRows,
} from "../../helpers/mapCompaniesToRows";
import {
  defaultColDef,
  createColumnDefs,
  createDevelopmentStageColumnDef,
  createTherapeuticAreaColumnDef,
} from "../../constants/columnDefs";
import { DrugProgramsDetailGrid } from "./DrugProgramsDetailGrid";
import { DataGrid, DataGridLayout } from "@components/Datagrid/index";
import { useFeatureFlags } from "@hooks/useFeatureFlags";
import {
  ColDef,
  RowGroupOpenedEvent,
  SizeColumnsToContentStrategy,
  ValueFormatterParams,
  ValueGetterParams,
} from "@ag-grid-community/core";
import { useTrackEvent } from "@/modules/app-insights/hooks/useTrackEvent";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import { useCompanyRealtimeData } from "./hooks/useCompanyRealtimeData";
import { IntradayBar } from "../../hooks/useIntradayBarsData";
import { formatMetric } from "@/utils/metrics";
import { RoleKinds } from "@/typings/Role";
import { hasRole, isAdmin } from "@/utils/roleUtils";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { orderColumnsByConfig } from "../../utils";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";

export interface CoverageUniverseGridProps {
  data: Company[];
  pending?: boolean;
  loading?: boolean;
  sort: Sort<string> | null;
  onSortChange: (sort: Sort<string> | null) => void;
  catalogFields?: MetricCatalogItem[];
  intradayBarsData?: IntradayBar[];
  realtimePriceData?: Record<
    number,
    { instrument_id: number; price: number; timestamp: string }[]
  >;
  enabledColumns?: string[];
  selectedBenchmark?: string | null;
}

const getRowId = (data: CompanyRow) => data.path.join(".");
const getDataPath = (data: CompanyRow) => data.path;
const autoSizeStrategy: SizeColumnsToContentStrategy = {
  type: "fitCellContents",
};

const canAccessYtdPnlByFund = [
  RoleKinds.PortfolioManager,
  RoleKinds.Admin,
  "External Beta User",
] as RoleKinds[];

export const CoverageUniverseGrid = ({
  data,
  sort,
  pending,
  loading,
  onSortChange,
  catalogFields = [],
  enabledColumns,
  selectedBenchmark = null,
}: CoverageUniverseGridProps) => {
  const { isFeatureEnabled } = useFeatureFlags();
  const { isMaximized } = usePanelMaximize();
  const { account } = useAuth();

  const enableKg = useMemo(
    () => isFeatureEnabled("enableKgFeatures"),
    [isFeatureEnabled]
  );
  const trackDrugSubtableExpanded = useTrackEvent("KGDrugSubtableExpanded");
  const rows = useMemo(() => mapCompaniesToRows(data), [data]);

  const { data: companyWithRealtimeData, isLoadingIntradayBars } =
    useCompanyRealtimeData({
      rows,
      loading,
    });

  const isAdminUser = isAdmin(account?.roles);

  const columns = useMemo(() => {
    const baseColumns: ColDef<CompanyRow>[] = [
      ...createColumnDefs(
        catalogFields,
        isLoadingIntradayBars,
        isAdminUser,
        selectedBenchmark
      ),
      {
        colId: "position_ytd_pnl_by_funds",
        field: "position_ytd_pnl_by_funds",
        headerName: "YTD PnL (%NAV)",
        headerTooltip: "YTD PnL (%NAV)",
        minWidth: 150,
        flex: 1,
        hide: !hasRole(account?.roles, canAccessYtdPnlByFund),
        suppressHeaderMenuButton: true,
        suppressHeaderFilterButton: true,
        valueGetter: (params: ValueGetterParams) => {
          return params.data?.position_ytd_pnl_by_funds?.find(
            (item: { fund: { name: string } }) => item.fund.name === "All"
          )?.ytd_pnl_percent_nav;
        },
        valueFormatter: (params: ValueFormatterParams<CompanyRow>) => {
          return formatMetric(
            params.data?.position_ytd_pnl_by_funds?.find(
              (item: { fund: { name: string } }) => item.fund.name === "All"
            )?.ytd_pnl_percent_nav,
            "percent"
          );
        },
        ...createFullPrecisionPercentTooltipProps({
          display_type: MetricDisplayType.percent,
        }),
      },
    ];

    if (enableKg) {
      baseColumns.push(createTherapeuticAreaColumnDef());
      baseColumns.push(createDevelopmentStageColumnDef());
    }

    if (enabledColumns && enabledColumns.includes("NetExposure")) {
      baseColumns.splice(1, 0, {
        colId: Column.NetExposure,
        headerClass: "scalable-table-header",
        headerName: "Net Exposure",
        headerTooltip: "Net Exposure (%NAV)",
        minWidth: 120,
        valueGetter: (params: ValueGetterParams<CompanyRow>) => {
          const allFundData = params.data?.position_exposure_by_funds?.find(
            (item) => item.fund.name === "All" || item.fund.id === -1
          );
          return allFundData?.exposure;
        },
        valueFormatter: (params: ValueFormatterParams<CompanyRow>) => {
          return formatMetric(
            params.data?.position_exposure_by_funds?.find(
              (item) => item.fund.name === "All" || item.fund.id === -1
            )?.exposure,
            "percent"
          );
        },
        comparator: () => 0,
        ...createFullPrecisionPercentTooltipProps({
          display_type: MetricDisplayType.percent,
        }),
      });
    }

    if (enabledColumns && enabledColumns.length > 0) {
      const filteredColumns = baseColumns.filter(
        (col) =>
          "colId" in col && col.colId && enabledColumns.includes(col.colId)
      );

      return orderColumnsByConfig(filteredColumns, enabledColumns);
    }

    return baseColumns;
  }, [
    catalogFields,
    isLoadingIntradayBars,
    account?.roles,
    enabledColumns,
    isAdminUser,
    enableKg,
    selectedBenchmark,
  ]);

  const handleSortChange = useCallback(
    (newSort: Sort<string> | null) => {
      onSortChange(newSort as Sort<Column> | null);
    },
    [onSortChange]
  );

  const isRowMaster = useCallback(
    (params: CompanyRow) =>
      enableKg && !!(params?.children && params.children.length > 0),
    [enableKg]
  );

  const handleRowGroupOpened = useCallback(
    (event: RowGroupOpenedEvent<CompanyRow>) => {
      if (!enableKg || !event.node.expanded) return;

      const rowData = event.node.data;
      if (!rowData?.id) return;

      trackDrugSubtableExpanded({
        companyId: rowData.id,
        drugCount: rowData.children?.length ?? 0,
      });
    },
    [enableKg, trackDrugSubtableExpanded]
  );

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({
      mode: isMaximized ? "normal" : "responsive",
    }),
    [isMaximized]
  );

  return (
    <DataGrid
      layout={dataGridLayout}
      tooltipMouseTrack
      rowData={companyWithRealtimeData}
      columnDefs={columns}
      detailCellRenderer={DrugProgramsDetailGrid}
      loading={loading}
      pending={pending}
      sort={sort}
      isRowMaster={isRowMaster}
      autoSizeStrategy={autoSizeStrategy}
      masterDetail={enableKg}
      suppressColumnVirtualisation={true}
      defaultColDef={defaultColDef}
      getDataPath={getDataPath}
      getRowId={getRowId}
      onSortChange={handleSortChange}
      onRowGroupOpened={handleRowGroupOpened}
      tooltipShowDelay={0}
      tooltipHideDelay={600000}
    />
  );
};
