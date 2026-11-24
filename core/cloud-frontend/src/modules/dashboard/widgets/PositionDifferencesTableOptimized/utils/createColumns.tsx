import {
  ColDef,
  SizeColumnsToFitGridStrategy,
  ValueFormatterParams,
} from "@ag-grid-community/core";
import {
  MetricDisplayType,
  MetricCatalogItem as MetricCatalogItem,
  PositionDifferencesResponseMetadata,
} from "@api/types/index";
import { formatMetric } from "@/utils/metrics";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

export const positionDifferencesDefaultColumn = {
  flex: 1,
  minWidth: 150,
  cellStyle: defaultStyle,
  resizable: false,
  headerClass: "dockview-table-header",
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
};

export const createPositionDifferencesColumns = (
  metricsCatalog: Array<MetricCatalogItem>,
  data: Array<Record<string, unknown>>,
  metadata?: PositionDifferencesResponseMetadata
): ColDef[] => {
  if (!data || data.length === 0) {
    return [];
  }

  const displayColumns = metadata?.display_columns || [];
  const fund1Name = metadata?.fund_1 || "Fund 1";
  const fund2Name = metadata?.fund_2 || "Fund 2";
  const groupByDimensions = metadata?.group_by || [];

  const dimensionField = groupByDimensions[0] || "instrument_group";

  const columns: ColDef[] = [];

  if (displayColumns.includes(dimensionField)) {
    const dimensionMetric = metricsCatalog.find(
      (m) => m.name === dimensionField
    );

    columns.push({
      colId: dimensionField,
      headerName: dimensionMetric?.display_name || "Group",
      field: dimensionField,
      resizable: false,
      headerTooltip: dimensionMetric?.description,
      valueFormatter: (params: ValueFormatterParams) =>
        formatMetric(params.value, MetricDisplayType.string),
      filter: "agTextColumnFilter",
      pinned: "left",
    });
  }

  if (displayColumns.includes("fund_1")) {
    columns.push({
      colId: "fund_1",
      headerName: fund1Name,
      field: "fund_1",
      resizable: false,
      headerTooltip: fund1Name,
      valueFormatter: (params: ValueFormatterParams) =>
        formatMetric(params.value, MetricDisplayType.percent),
      comparator: (valueA: number, valueB: number) => {
        if (valueA === null || valueA === undefined) return 1;
        if (valueB === null || valueB === undefined) return -1;
        return valueA - valueB;
      },
      ...createFullPrecisionPercentTooltipProps({
        display_type: MetricDisplayType.percent,
      }),
    });
  }

  if (displayColumns.includes("fund_2")) {
    columns.push({
      colId: "fund_2",
      headerName: fund2Name,
      field: "fund_2",
      resizable: false,
      headerTooltip: fund2Name,
      valueFormatter: (params: ValueFormatterParams) =>
        formatMetric(params.value, MetricDisplayType.percent),
      comparator: (valueA: number, valueB: number) => {
        if (valueA === null || valueA === undefined) return 1;
        if (valueB === null || valueB === undefined) return -1;
        return valueA - valueB;
      },
      ...createFullPrecisionPercentTooltipProps({
        display_type: MetricDisplayType.percent,
      }),
    });
  }

  if (displayColumns.includes("difference")) {
    columns.push({
      colId: "difference",
      headerName: "Difference",
      field: "difference",
      resizable: false,
      pinned: "right",
      lockPinned: true,
      headerTooltip: "Difference between funds",
      valueFormatter: (params: ValueFormatterParams) =>
        formatMetric(params.value, MetricDisplayType.percent),
      cellClass: "right-pinned",
      comparator: (valueA: number, valueB: number) => {
        if (valueA === null || valueA === undefined) return 1;
        if (valueB === null || valueB === undefined) return -1;
        return Math.abs(valueA) - Math.abs(valueB);
      },
      sort: "desc",
      ...createFullPrecisionPercentTooltipProps({
        display_type: MetricDisplayType.percent,
      }),
    });
  }

  return columns;
};

export const defaultDataGridProps = {
  defaultColDef: positionDifferencesDefaultColumn,
  sideBar: false,
  groupDefaultExpanded: -1,
  suppressAggFuncInHeader: true,
  animateRows: false,
};

export const autoSizeStrategy: SizeColumnsToFitGridStrategy = {
  type: "fitGridWidth",
};
