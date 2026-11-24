import { ColDef, ICellRendererParams } from "@ag-grid-community/core";

import { Avatars } from "@/components/Avatars";
import type { MetricDisplayType, UserResponse } from "@/api/types";
import { cellColor } from "@/utils/ag-grid/cells";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";

import {
  type ParsedUser,
  type PnlByNewCompaniesCompanyViewTableRow,
} from "./PnlByNewCompaniesCompanyViewTable.utils";

const defaultCellStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

export const pnlByNewCompaniesCompanyViewDefaultColDef: ColDef<PnlByNewCompaniesCompanyViewTableRow> =
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
  defaultColDef: pnlByNewCompaniesCompanyViewDefaultColDef,
  sideBar: false,
  suppressAggFuncInHeader: true,
  animateRows: false,
  groupHeaderHeight: 30,
  headerHeight: 30,
};

const companyColumn: ColDef<PnlByNewCompaniesCompanyViewTableRow> = {
  colId: "company_name",
  field: "company_name",
  headerName: "Company",
  headerTooltip:
    "Only companies tagged with at least one Venture Analyst appear in this card.",
  pinned: "left",
  minWidth: 180,
  flex: 1.3,
  cellStyle: { ...defaultCellStyle, justifyContent: "flex-start" },
};

const ventureAnalystsColumn: ColDef<PnlByNewCompaniesCompanyViewTableRow> = {
  colId: "venture_analyst_avatars",
  field: "venture_analysts",
  headerName: "Venture Analyst(s)",
  headerTooltip:
    "All analysts ever tagged as Venture Analyst on this company. Multiple analysts can cover the same company across non-overlapping periods.",
  minWidth: 140,
  flex: 1,
  sortable: false,
  cellStyle: { ...defaultCellStyle, justifyContent: "flex-start" },
  cellRenderer: (
    params: ICellRendererParams<
      PnlByNewCompaniesCompanyViewTableRow,
      ParsedUser[]
    >
  ) => {
    if (params.node.rowPinned) {
      const count = params.data?.venture_analyst_count;
      return <span>{count ?? ""}</span>;
    }
    const analysts = params.value ?? [];
    if (analysts.length === 0) {
      return <span className="text-neutral-400">—</span>;
    }
    return (
      <div className="flex items-center overflow-hidden">
        <Avatars
          data={analysts as unknown as UserResponse[]}
          maxVisibleAvatars={3}
          testId="pnl-by-new-companies-company-view-analysts"
        />
      </div>
    );
  },
};

type CatalogMap = Record<string, { display_name: string; description: string }>;

interface NumericColumnConfig {
  field: keyof PnlByNewCompaniesCompanyViewTableRow;
  headerName: string;
  displayType: MetricDisplayType;
  minWidth?: number;
  digits?: number;
  catalogKey?: string;
  tooltipKey?: string;
}

const buildNumericColumn = (
  {
    field,
    headerName,
    displayType,
    minWidth = 120,
    digits,
    catalogKey,
    tooltipKey,
  }: NumericColumnConfig,
  catalogMap: CatalogMap
): ColDef<PnlByNewCompaniesCompanyViewTableRow> => {
  const key = catalogKey ?? String(field);
  return {
    colId: String(field),
    field: field as ColDef<PnlByNewCompaniesCompanyViewTableRow>["field"],
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
      return formatMetric(
        params.value,
        displayType,
        digits !== undefined ? { digits } : undefined
      );
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
): ColDef<PnlByNewCompaniesCompanyViewTableRow> =>
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

export const createPnlByNewCompaniesCompanyViewColumns = (
  catalogMap: CatalogMap = {}
): ColDef<PnlByNewCompaniesCompanyViewTableRow>[] => [
  companyColumn,
  ventureAnalystsColumn,
  buildNumericColumn(
    {
      field: "total_invested_capital",
      headerName: "Total Invested",
      displayType: "dollars" as MetricDisplayType,
      minWidth: 140,
      catalogKey: "total_invested_capital",
    },
    catalogMap
  ),
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
  buildNumericColumn(
    {
      field: "moic",
      headerName: "MOIC",
      displayType: "ratio" as MetricDisplayType,
      minWidth: 100,
    },
    catalogMap
  ),
  buildNumericColumn(
    {
      field: "xirr",
      headerName: "XIRR (ITD)",
      displayType: "percent" as MetricDisplayType,
      minWidth: 100,
    },
    catalogMap
  ),
  buildNumericColumn(
    {
      field: "holding_period_years",
      headerName: "Holding Period (Yr)",
      displayType: "float" as MetricDisplayType,
      minWidth: 130,
      digits: 1,
    },
    catalogMap
  ),
  buildAlphaColumn("alpha_primary", "alpha_vs_xbi", catalogMap),
  buildAlphaColumn("alpha_secondary", "alpha_vs_rgushsbt", catalogMap),
];
