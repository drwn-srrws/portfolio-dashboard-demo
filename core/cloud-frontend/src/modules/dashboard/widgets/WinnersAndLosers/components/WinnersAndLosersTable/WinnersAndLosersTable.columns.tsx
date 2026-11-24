import {
  SizeColumnsToFitGridStrategy,
  ValueFormatterParams,
} from "@ag-grid-community/core";

import {
  MetricCatalogItem as MetricCatalogItem,
  MetricResultDataAnyOfItem,
} from "@api/types/index";
import { cellColor } from "@utils/ag-grid/cells";
import { formatMetric, getValueStatusForMetric } from "@utils/metrics";
import { createFullPrecisionPercentTooltipProps } from "@utils/ag-grid/tooltips";
import { NestedTableEntry } from "@/utils/table";

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

export const winnersAndLosersAutoGroupColumn = {
  flex: 1,
  headerName: "Instrument Group",
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
  resizable: true,
};

export const winnersAndLosersDefaultColumn = {
  flex: 1,
  cellStyle: {
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
  resizable: false,
  headerClass: "dockview-table-header",
  cellRendererParams: {
    suppressCount: true,
  },
  valueFormatter: (
    params: ValueFormatterParams<NestedTableEntry<MetricResultDataAnyOfItem>>
  ) => {
    const value = params.value;
    const count = params.node?.childrenAfterGroup?.length;
    const label = count ? `${value} (${count})` : value;

    return label;
  },
};

export const createWinnersAndLosersColumns = (
  selectedMetrics: Array<MetricCatalogItem>,
  columnsOrder: string[],
  decimalPrecision: number = 2
) => {
  return columnsOrder.map((key) => {
    const metric = selectedMetrics.find((metric) => metric.name === key);

    return {
      colId: metric?.name,
      headerName: metric?.display_name,
      headerTooltip: metric?.description || metric?.display_name,
      field: metric?.name,
      resizable: true,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      valueFormatter: (
        params: ValueFormatterParams<
          NestedTableEntry<MetricResultDataAnyOfItem>
        >
      ) =>
        metric?.display_type
          ? formatMetric(params.value, metric?.display_type, {
              digits: decimalPrecision,
            })
          : "",
      ...createFullPrecisionPercentTooltipProps(metric),
      cellStyle: (
        params: ValueFormatterParams<
          NestedTableEntry<MetricResultDataAnyOfItem>
        >
      ) => {
        const status = getValueStatusForMetric({
          value: params.value,
          metric,
        });

        return {
          ...defaultStyle,
          color: cellColor[status],
        };
      },
    };
  });
};

export const defaultDataGridProps = {
  defaultColDef: winnersAndLosersDefaultColumn,
  sideBar: false,
  groupDefaultExpanded: 0,
  suppressAggFuncInHeader: true,
  treeData: true,
  animateRows: false,
};

export const autoSizeStrategy: SizeColumnsToFitGridStrategy = {
  type: "fitGridWidth",
};
