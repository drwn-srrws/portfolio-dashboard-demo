import { ColDef } from "@ag-grid-community/core";

import { MetricDisplayType, FundSummaryStats } from "@api/types/index";
import { cellColor } from "@/utils/ag-grid/cells";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";

import { defaultStyle } from "./constants";

export const getMetricDisplayType = (name: string | undefined) =>
  name === "NAV" ? MetricDisplayType.dollars : MetricDisplayType.percent;

export const getRowId = (data: FundSummaryStats) => data.name;

export const nameColumn: ColDef<FundSummaryStats> = {
  colId: "name",
  headerName: "Name",
  field: "name",
  flex: 1,
  minWidth: 150,
  resizable: true,
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
};

export const valueColumn: ColDef<FundSummaryStats> = {
  colId: "value",
  headerName: "Value",
  field: "value",
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
  valueFormatter: (params) => {
    const displayType = getMetricDisplayType(params.data?.name);
    return formatMetric(params.data?.value, displayType);
  },
  cellStyle: (params) => {
    const displayType = getMetricDisplayType(params.data?.name);
    const status = getValueStatusForMetric({
      value: params.data?.value,
      metric: { display_type: displayType },
    });
    return { ...defaultStyle, color: cellColor[status] };
  },
  comparator: (valueA: number, valueB: number) => valueA - valueB,
  tooltipValueGetter: (params) => {
    const metric = { display_type: getMetricDisplayType(params.data?.name) };
    const tooltipProps = createFullPrecisionPercentTooltipProps(metric);
    return tooltipProps.tooltipValueGetter?.(params) || "";
  },
};

export const columns: ColDef<FundSummaryStats>[] = [nameColumn, valueColumn];
