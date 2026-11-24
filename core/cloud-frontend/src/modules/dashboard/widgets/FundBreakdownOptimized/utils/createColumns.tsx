import {
  ColDef,
  SizeColumnsToFitGridStrategy,
  ValueFormatterParams,
} from "@ag-grid-community/core";
import { MetricCatalogItem as MetricCatalogItem } from "@api/types/index";
import { cellColor } from "@/utils/ag-grid/cells";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

export const fundBreakdownOptimizedDefaultColumn = {
  flex: 1,
  minWidth: 70,
  cellStyle: defaultStyle,
  resizable: false,
  headerClass: "dockview-table-header",
};

// TODO: Remove once the backend returns catalog metric names in display_columns
// (e.g. net_exposure_percent instead of exposure_percent).
const CATALOG_KEY_OVERRIDES: Record<string, string> = {
  exposure_percent: "net_exposure_percent",
};

const findCatalogEntry = (
  catalog: MetricCatalogItem[],
  fieldName: string
): MetricCatalogItem | undefined => {
  const catalogKey = CATALOG_KEY_OVERRIDES[fieldName] ?? fieldName;
  return catalog.find((m) => m.name === catalogKey);
};

export const createFundBreakdownOptimizedColumns = (
  metricsCatalog: MetricCatalogItem[],
  metricNames: string[]
): ColDef[] => {
  return metricNames.map((key) => {
    const metric = findCatalogEntry(metricsCatalog, key);

    return {
      colId: key,
      headerName: metric?.display_name ?? key,
      headerTooltip: metric?.description || metric?.display_name,
      field: key,
      resizable: false,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      valueFormatter: (params: ValueFormatterParams) =>
        metric?.display_type
          ? formatMetric(params.value, metric.display_type)
          : "",
      cellStyle: (params: ValueFormatterParams) => {
        const status = getValueStatusForMetric({ value: params.value, metric });
        return {
          ...defaultStyle,
          color: cellColor[status],
        };
      },
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      ...createFullPrecisionPercentTooltipProps(metric),
    };
  });
};

export const autoSizeStrategy: SizeColumnsToFitGridStrategy = {
  type: "fitGridWidth",
};

export const defaultDataGridProps = {
  flex: 1,
  minWidth: 150,
  defaultColDef: fundBreakdownOptimizedDefaultColumn,
  sideBar: false,
  groupDefaultExpanded: 0,
  suppressAggFuncInHeader: true,
  treeData: true,
  animateRows: false,
};
