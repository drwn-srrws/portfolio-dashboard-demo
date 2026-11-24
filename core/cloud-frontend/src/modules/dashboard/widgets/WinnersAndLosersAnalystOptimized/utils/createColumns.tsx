import {
  SizeColumnsToFitGridStrategy,
  ValueFormatterParams,
  ColDef,
} from "@ag-grid-community/core";

import { MetricCatalogItem } from "@api/types/index";
import { cellColor } from "@utils/ag-grid/cells";
import { formatMetric, getValueStatusForMetric } from "@utils/metrics";
import { createFullPrecisionPercentTooltipProps } from "@utils/ag-grid/tooltips";

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

export const winnersAndLosersDefaultColumn = {
  flex: 1,
  minWidth: 150,
  cellStyle: defaultStyle,
  resizable: true,
  headerClass: "dockview-table-header",
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
};

export const createWinnersAndLosersColumns = (
  metricsCatalog: Array<MetricCatalogItem>,
  metricNames: string[],
  decimalPrecision: number = 2
): ColDef[] => {
  return metricNames
    .map((columnName) => {
      const metric = metricsCatalog.find((m) => m.name === columnName);
      if (!metric) return null;

      return {
        colId: metric.name,
        headerName: metric.display_name,
        headerTooltip: metric.description || metric.display_name,
        field: metric.name,
        resizable: true,
        suppressHeaderMenuButton: true,
        suppressHeaderFilterButton: true,
        valueFormatter: (
          params: ValueFormatterParams<Record<string, unknown>>
        ) =>
          metric.display_type
            ? formatMetric(params.value, metric.display_type, {
                digits: decimalPrecision,
              })
            : "",
        cellStyle: (params: ValueFormatterParams<Record<string, unknown>>) => {
          const status = getValueStatusForMetric({
            value: params.value,
            metric,
          });
          return { ...defaultStyle, color: cellColor[status] };
        },
        ...createFullPrecisionPercentTooltipProps(metric),
      } as ColDef;
    })
    .filter(Boolean) as ColDef[];
};

export const defaultDataGridProps = {
  defaultColDef: winnersAndLosersDefaultColumn,
  sideBar: false,
  suppressAggFuncInHeader: true,
  animateRows: false,
  rowSelection: "multiple" as const,
  treeData: true,
};

export const autoSizeStrategy: SizeColumnsToFitGridStrategy = {
  type: "fitGridWidth",
};
