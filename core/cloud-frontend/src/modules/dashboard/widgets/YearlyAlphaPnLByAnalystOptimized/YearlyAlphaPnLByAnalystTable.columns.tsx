import { ColDef, ICellRendererParams } from "@ag-grid-community/core";

import { Avatar } from "@/components/Avatar";
import type { MetricDisplayType } from "@/api/types";
import { cellColor } from "@/utils/ag-grid/cells";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";

import {
  formatUserFullName,
  isYearColumn,
  TOTAL_COLUMN_KEY,
  type ParsedUser,
  type YearlyAlphaPnLByAnalystTableRow,
} from "./YearlyAlphaPnLByAnalystTable.utils";

const defaultCellStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

export const yearlyAlphaPnLByAnalystDefaultColDef: ColDef<YearlyAlphaPnLByAnalystTableRow> =
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
  defaultColDef: yearlyAlphaPnLByAnalystDefaultColDef,
  sideBar: false,
  suppressAggFuncInHeader: true,
  animateRows: false,
  groupHeaderHeight: 30,
  headerHeight: 30,
};

const primaryAnalystColumn: ColDef<YearlyAlphaPnLByAnalystTableRow> = {
  colId: "primary_analyst_avatar",
  field: "primary_analyst",
  headerName: "1° Analyst",
  pinned: "left",
  width: 66,
  minWidth: 66,
  maxWidth: 66,
  flex: 0,
  resizable: false,
  cellStyle: { ...defaultCellStyle, justifyContent: "center" },
  cellRenderer: (
    params: ICellRendererParams<
      YearlyAlphaPnLByAnalystTableRow,
      ParsedUser | null
    >
  ) => {
    const user = params.value;
    if (!user) {
      return <span className="text-neutral-400">—</span>;
    }
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Avatar data={user} />
      </div>
    );
  },
  valueGetter: (params) => params.data?.primary_analyst ?? null,
  comparator: (_a: ParsedUser | null, _b: ParsedUser | null, nodeA, nodeB) => {
    const aName =
      nodeA.data?.primary_analyst_name ??
      (nodeA.data?.primary_analyst
        ? formatUserFullName(nodeA.data.primary_analyst)
        : "");
    const bName =
      nodeB.data?.primary_analyst_name ??
      (nodeB.data?.primary_analyst
        ? formatUserFullName(nodeB.data.primary_analyst)
        : "");
    return aName.localeCompare(bName);
  },
};

const percentDisplayType: MetricDisplayType = "percent" as MetricDisplayType;

const buildYearColumn = (
  year: string
): ColDef<YearlyAlphaPnLByAnalystTableRow> => ({
  colId: year,
  headerName: year,
  minWidth: 90,
  flex: 1,
  cellStyle: (params) => {
    const status = getValueStatusForMetric({
      value: params.value as number | null,
      metric: { display_type: percentDisplayType },
    });
    return {
      ...defaultCellStyle,
      justifyContent: "flex-start",
      color: cellColor[status],
    };
  },
  valueGetter: (params) => params.data?.yearValues?.[year] ?? null,
  valueFormatter: (params) =>
    formatMetric(params.value as number | null, percentDisplayType),
  comparator: (a: number | null, b: number | null) =>
    (a ?? Number.NEGATIVE_INFINITY) - (b ?? Number.NEGATIVE_INFINITY),
  ...createFullPrecisionPercentTooltipProps({
    display_type: percentDisplayType,
  }),
});

const totalColumn: ColDef<YearlyAlphaPnLByAnalystTableRow> = {
  colId: TOTAL_COLUMN_KEY,
  field: "total",
  headerName: TOTAL_COLUMN_KEY,
  minWidth: 160,
  flex: 1.2,
  cellStyle: (params) => {
    const status = getValueStatusForMetric({
      value: params.value as number | null,
      metric: { display_type: percentDisplayType },
    });
    return {
      ...defaultCellStyle,
      justifyContent: "flex-start",
      color: cellColor[status],
      fontWeight: 600,
    };
  },
  valueFormatter: (params) =>
    formatMetric(params.value as number | null, percentDisplayType),
  comparator: (a: number | null, b: number | null) =>
    (a ?? Number.NEGATIVE_INFINITY) - (b ?? Number.NEGATIVE_INFINITY),
  ...createFullPrecisionPercentTooltipProps({
    display_type: percentDisplayType,
  }),
};

/**
 * Build columns dynamically from the backend's display_columns metadata:
 * analyst avatar (pinned) + one column per year + ALPHA PNL (% NMV) total.
 * Falls back to a sensible default range when display_columns is empty
 * (initial render / loading state).
 */
export const createYearlyAlphaPnLByAnalystColumns = (
  displayColumns: string[]
): ColDef<YearlyAlphaPnLByAnalystTableRow>[] => {
  const yearColumns = displayColumns.filter(isYearColumn);
  return [
    primaryAnalystColumn,
    ...yearColumns.map(buildYearColumn),
    totalColumn,
  ];
};
