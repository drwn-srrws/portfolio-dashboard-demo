import { ColDef, ICellRendererParams } from "@ag-grid-community/core";

import { Avatar } from "@/components/Avatar";
import type { MetricDisplayType } from "@/api/types";
import { cellColor } from "@/utils/ag-grid/cells";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";

import {
  formatUserFullName,
  type ParsedUser,
  type PnlByNewCompaniesAnalystViewTableRow,
} from "./PnlByNewCompaniesAnalystViewTable.utils";

const defaultCellStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

const VENTURE_ANALYST_HEADER_TOOLTIP =
  "Only analysts tagged as Venture Analyst on at least one company appear in this card. Metrics are scoped to the periods each analyst was tagged.";

export const pnlByNewCompaniesAnalystViewDefaultColDef: ColDef<PnlByNewCompaniesAnalystViewTableRow> =
  {
    resizable: true,
    flex: 1,
    minWidth: 80,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    cellStyle: { ...defaultCellStyle, justifyContent: "flex-start" },
    headerClass: "dockview-table-header",
  };

export const defaultDataGridProps = {
  defaultColDef: pnlByNewCompaniesAnalystViewDefaultColDef,
  sideBar: false,
  suppressAggFuncInHeader: true,
  animateRows: false,
  groupHeaderHeight: 30,
  headerHeight: 30,
  treeData: true,
  groupDefaultExpanded: 0,
};

export const createPnlByNewCompaniesAnalystAutoGroupColumnDef =
  (): ColDef<PnlByNewCompaniesAnalystViewTableRow> => ({
    colId: "venture_analyst",
    headerName: "Venture Analyst",
    headerTooltip: VENTURE_ANALYST_HEADER_TOOLTIP,
    pinned: "left",
    minWidth: 100,
    flex: 0.6,
    resizable: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    headerClass: "dockview-table-header",
    cellStyle: { ...defaultCellStyle, justifyContent: "flex-start" },
    cellRendererParams: {
      suppressCount: true,
      innerRenderer: (
        params: ICellRendererParams<PnlByNewCompaniesAnalystViewTableRow>
      ) => {
        if (params.node?.rowPinned) {
          return <span>{params.data?.venture_analyst_name ?? "Total"}</span>;
        }
        if (params.node?.level === 0) {
          const user = params.data?.venture_analyst as ParsedUser | null;
          if (!user) {
            return <span className="text-neutral-400">—</span>;
          }
          return (
            <div className="flex items-center p-2">
              <Avatar data={user} />
            </div>
          );
        }
        // Level 1: company name
        return <span>{params.data?.company_name ?? params.value ?? "—"}</span>;
      },
    },
    comparator: (_a: unknown, _b: unknown, nodeA, nodeB) => {
      const aName =
        nodeA.data?.venture_analyst_name ??
        (nodeA.data?.venture_analyst
          ? formatUserFullName(nodeA.data.venture_analyst)
          : "");
      const bName =
        nodeB.data?.venture_analyst_name ??
        (nodeB.data?.venture_analyst
          ? formatUserFullName(nodeB.data.venture_analyst)
          : "");
      return aName.localeCompare(bName);
    },
  });

type CatalogMap = Record<string, { display_name: string; description: string }>;

interface NumericColumnConfig {
  field: keyof PnlByNewCompaniesAnalystViewTableRow;
  headerName: string;
  displayType: MetricDisplayType;
  minWidth?: number;
  catalogKey?: string;
  tooltipKey?: string;
}

const buildNumericColumn = (
  {
    field,
    headerName,
    displayType,
    minWidth = 120,
    catalogKey,
    tooltipKey,
  }: NumericColumnConfig,
  catalogMap: CatalogMap
): ColDef<PnlByNewCompaniesAnalystViewTableRow> => {
  const key = catalogKey ?? String(field);
  return {
    colId: String(field),
    field: field as ColDef<PnlByNewCompaniesAnalystViewTableRow>["field"],
    headerName: catalogMap[key]?.display_name ?? headerName,
    headerTooltip: catalogMap[tooltipKey ?? key]?.description,
    minWidth,
    flex: 1,
    cellStyle: (params) => {
      const status = getValueStatusForMetric({
        value: params.value as number | null,
        metric: { display_type: displayType },
      });
      return {
        ...defaultCellStyle,
        justifyContent: "flex-start",
        color: cellColor[status],
      };
    },
    valueFormatter: (params) => {
      if (
        params.node?.rowPinned &&
        (params.value === null || params.value === undefined)
      ) {
        return "";
      }
      return formatMetric(params.value, displayType);
    },
    comparator: (a: number | null, b: number | null) =>
      (a ?? Number.NEGATIVE_INFINITY) - (b ?? Number.NEGATIVE_INFINITY),
    ...createFullPrecisionPercentTooltipProps({ display_type: displayType }),
  };
};

const buildAlphaColumn = (
  field: "alpha_primary" | "alpha_secondary",
  catalogKey: "alpha_vs_xbi" | "alpha_vs_rgushsbt",
  catalogMap: CatalogMap
): ColDef<PnlByNewCompaniesAnalystViewTableRow> =>
  buildNumericColumn(
    {
      field,
      headerName: `Alpha (vs ${catalogKey})`,
      displayType: "percent" as MetricDisplayType,
      catalogKey,
      tooltipKey: "cumulative_alpha_pnl_percent",
    },
    catalogMap
  );

// PHASE_2_COLUMNS: MOIC / IRR (xirr_itd) / Duration columns will be
// added here when reference v2 ships analyst-level XIRR aggregation.
export const createPnlByNewCompaniesAnalystViewColumns = (
  catalogMap: CatalogMap = {}
): ColDef<PnlByNewCompaniesAnalystViewTableRow>[] => [
  buildNumericColumn(
    {
      field: "net_exposure",
      headerName: "Net Exposure",
      displayType: "dollars" as MetricDisplayType,
      minWidth: 140,
      catalogKey: "net_exposure",
    },
    catalogMap
  ),
  buildNumericColumn(
    {
      field: "cumulative_pnl_percent_nav",
      headerName: "PnL (%NAV)",
      displayType: "percent" as MetricDisplayType,
    },
    catalogMap
  ),
  buildNumericColumn(
    {
      field: "cumulative_pnl",
      headerName: "PnL ($)",
      displayType: "pnl" as MetricDisplayType,
    },
    catalogMap
  ),
  buildAlphaColumn("alpha_primary", "alpha_vs_xbi", catalogMap),
  buildAlphaColumn("alpha_secondary", "alpha_vs_rgushsbt", catalogMap),
];
