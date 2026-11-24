import { ColDef, ICellRendererParams } from "@ag-grid-community/core";

import { MetricDisplayType } from "@/api/types";
import { Avatar } from "@/components/Avatar";
import { Avatars } from "@/components/Avatars";
import { cellColor } from "@/utils/ag-grid/cells";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";

import {
  ParsedUser,
  PnlBySubteamTableRow,
  formatUserFullName,
} from "./PnlBySubteamTable.utils";
import type { UserResponse } from "@/api/types";

const defaultCellStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

export const pnlBySubteamDefaultColDef: ColDef<PnlBySubteamTableRow> = {
  resizable: true,
  flex: 1,
  minWidth: 80,
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
  cellStyle: { ...defaultCellStyle, justifyContent: "flex-start" },
  headerClass: "dockview-table-header",
};

export const defaultDataGridProps = {
  defaultColDef: pnlBySubteamDefaultColDef,
  sideBar: false,
  suppressAggFuncInHeader: true,
  animateRows: false,
  groupHeaderHeight: 30,
  headerHeight: 30,
};

const teamLeadColumn: ColDef<PnlBySubteamTableRow> = {
  colId: "team_lead",
  field: "team_lead",
  headerName: "Team Lead",
  headerTooltip: "Current team lead for the sub-team",
  pinned: "left",
  minWidth: 100,
  flex: 0.6,
  cellStyle: { ...defaultCellStyle, justifyContent: "flex-start", gap: 8 },
  cellRenderer: (
    params: ICellRendererParams<PnlBySubteamTableRow, ParsedUser | null>
  ) => {
    const user = params.value;
    if (!user) return <span className="text-neutral-400">—</span>;
    return (
      <div className="flex items-center">
        <Avatar data={user} dense />
      </div>
    );
  },
  valueGetter: (params) => params.data?.team_lead ?? null,
  comparator: (a: ParsedUser | null, b: ParsedUser | null) => {
    const aName = a ? formatUserFullName(a) : "";
    const bName = b ? formatUserFullName(b) : "";
    return aName.localeCompare(bName);
  },
};

const teamMembersColumn: ColDef<PnlBySubteamTableRow> = {
  colId: "team_members",
  field: "team_members",
  headerName: "Team Members",
  headerTooltip: "Current active members of the sub-team",
  minWidth: 140,
  flex: 1,
  sortable: false,
  cellStyle: { ...defaultCellStyle, justifyContent: "flex-start", gap: 8 },
  cellRenderer: (
    params: ICellRendererParams<PnlBySubteamTableRow, ParsedUser[]>
  ) => {
    const members = params.value ?? [];
    if (members.length === 0) {
      return <span className="text-neutral-400">—</span>;
    }
    return (
      <div className="flex items-center overflow-hidden">
        <Avatars
          data={members as unknown as UserResponse[]}
          maxVisibleAvatars={4}
          testId="pnl-by-subteam-members"
        />
      </div>
    );
  },
};

type CatalogMap = Record<string, { display_name: string; description: string }>;

interface NumericColumnConfig {
  field: keyof PnlBySubteamTableRow;
  headerName: string;
  displayType: MetricDisplayType;
  minWidth?: number;
}

const buildNumericColumn = (
  { field, headerName, displayType, minWidth = 120 }: NumericColumnConfig,
  catalogMap: CatalogMap
): ColDef<PnlBySubteamTableRow> => ({
  colId: String(field),
  field: field as ColDef<PnlBySubteamTableRow>["field"],
  headerName: catalogMap[String(field)]?.display_name ?? headerName,
  headerTooltip: catalogMap[String(field)]?.description,
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
  valueFormatter: (params) => formatMetric(params.value, displayType),
  comparator: (a: number | null, b: number | null) =>
    (a ?? Number.NEGATIVE_INFINITY) - (b ?? Number.NEGATIVE_INFINITY),
  ...createFullPrecisionPercentTooltipProps({ display_type: displayType }),
});

export const createPnlBySubteamColumns = (
  alphaHeader: string,
  catalogMap: CatalogMap = {}
): ColDef<PnlBySubteamTableRow>[] => [
  teamLeadColumn,
  teamMembersColumn,
  buildNumericColumn(
    {
      field: "average_net_exposure",
      headerName: "AVG NMV ($)",
      displayType: "dollars" as MetricDisplayType,
    },
    catalogMap
  ),
  buildNumericColumn(
    {
      field: "cumulative_group_pnl_percent",
      headerName: "PnL (%NMV)",
      displayType: "percent" as MetricDisplayType,
    },
    catalogMap
  ),
  {
    ...buildNumericColumn(
      {
        field: "alpha",
        headerName: alphaHeader,
        displayType: "percent" as MetricDisplayType,
      },
      catalogMap
    ),
    headerTooltip: catalogMap["cumulative_alpha_pnl_percent"]?.description,
  },
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
];
