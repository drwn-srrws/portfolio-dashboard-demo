import {
  ColDef,
  SizeColumnsToContentStrategy,
  ValueFormatterParams,
} from "@ag-grid-community/core";
import { MetricDisplayType } from "@/api/types";
import { cellColor } from "@/utils/ag-grid/cells";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

export const defaultColDef: ColDef = {
  flex: 1,
  minWidth: 150,
  cellStyle: defaultStyle,
  resizable: false,
  headerClass: "dockview-table-header",
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
};

export const defaultGridProps = {
  defaultColDef,
  sideBar: false,
  suppressAggFuncInHeader: true,
  animateRows: false,
  groupDefaultExpanded: 0,
};

export const autoSizeStrategy: SizeColumnsToContentStrategy = {
  type: "fitCellContents",
};

const YEAR_PATTERN = /^\d{4}$/;

export const createYearlyAlphaPnLOptimizedColumns = (
  displayColumns: string[],
  groupByColumns: string[],
  metricDisplayType: MetricDisplayType,
  metricDescription?: string
): ColDef[] => {
  const yearColumns = displayColumns.filter((col) => YEAR_PATTERN.test(col));
  const nameColumns = displayColumns.filter(
    (col) => groupByColumns.includes(col) || col === "benchmark_id"
  );
  const totalColumns = displayColumns.filter(
    (col) =>
      !YEAR_PATTERN.test(col) &&
      !groupByColumns.includes(col) &&
      col !== "benchmark_id"
  );

  const nameColDefs: ColDef[] = nameColumns.map((col) => ({
    colId: col,
    field: col,
    headerName: groupByColumns.includes(col) ? "Name" : "Benchmark",
    resizable: true,
    valueFormatter: (params: ValueFormatterParams) =>
      params.value != null ? String(params.value) : "-",
  }));

  const yearColDefs: ColDef[] = yearColumns.map((year) => ({
    colId: year,
    field: year,
    headerName: year,
    resizable: true,
    maxWidth: 90,
    filter: "agNumberColumnFilter",
    headerTooltip: metricDescription || "",
    valueFormatter: (params: ValueFormatterParams) =>
      params ? formatMetric(params.value || 0, metricDisplayType) : "-",
    cellStyle: (params: ValueFormatterParams) => {
      const status = getValueStatusForMetric({
        value: params.value,
        metric: { display_type: metricDisplayType },
      });
      return { ...defaultStyle, color: cellColor[status] };
    },
    ...createFullPrecisionPercentTooltipProps({
      display_type: metricDisplayType,
    }),
  }));

  const totalColDefs: ColDef[] = totalColumns.map((col) => ({
    colId: col,
    field: col,
    headerName: col,
    headerTooltip: metricDescription || col,
    resizable: false,
    lockPinned: true,
    valueFormatter: (params: ValueFormatterParams) =>
      params.value != null ? formatMetric(params.value, metricDisplayType) : "",
    cellStyle: (params: ValueFormatterParams) => {
      const status = getValueStatusForMetric({
        value: params.value,
        metric: { display_type: metricDisplayType },
      });
      return { ...defaultStyle, color: cellColor[status] };
    },
    ...createFullPrecisionPercentTooltipProps({
      display_type: metricDisplayType,
    }),
  }));

  return [...nameColDefs, ...yearColDefs, ...totalColDefs];
};
