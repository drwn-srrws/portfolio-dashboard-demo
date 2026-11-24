import { MetricCatalogItem, MetricResult } from "@api/types/index";
import { cellColor } from "@/utils/ag-grid/cells";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import {
  SizeColumnsToFitGridStrategy,
  ValueFormatterParams,
} from "@ag-grid-community/core";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

export const defaultColDef = {
  flex: 1,
  minWidth: 70,
  cellStyle: defaultStyle,
  resizable: false,
  headerClass: "dockview-table-header",
};

export const defaultDataGridProps = {
  defaultColDef,
  sideBar: false,
  groupDefaultExpanded: 0,
  suppressAggFuncInHeader: true,
  treeData: true,
  animateRows: false,
};

export const autoSizeStrategy: SizeColumnsToFitGridStrategy = {
  type: "fitGridWidth",
};

export const createLiquiditySummaryColumns = (
  selectedMetrics: Array<MetricCatalogItem>,
  defaultMetrics: string[]
) => {
  return defaultMetrics.map((key) => {
    const metric = selectedMetrics.find((metric) => metric.name === key);

    return {
      colId: metric?.name,
      headerName: metric?.display_name,
      headerTooltip: metric?.description || metric?.display_name,
      field: metric?.name,
      suppressHeaderMenuButton: true,
      resizeable: true,
      suppressHeaderFilterButton: true,
      valueFormatter: (params: ValueFormatterParams<MetricResult>) =>
        metric?.display_type
          ? formatMetric(params.value, metric?.display_type)
          : "",
      cellStyle: (params: ValueFormatterParams<MetricResult>) => {
        const status = getValueStatusForMetric({
          value: params.value,
          metric,
        });

        return {
          ...defaultStyle,
          color: cellColor[status],
        };
      },
      comparator: (a: number, b: number) => a - b,
      ...createFullPrecisionPercentTooltipProps(metric),
    };
  });
};
