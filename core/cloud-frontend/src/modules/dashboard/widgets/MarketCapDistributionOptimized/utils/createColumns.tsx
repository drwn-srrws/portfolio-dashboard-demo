import {
  ColDef,
  SizeColumnsToFitGridStrategy,
  ValueFormatterParams,
} from "@ag-grid-community/core";
import { MetricCatalogItem as MetricCatalogItem } from "@api/types/index";
import { cellColor } from "@/utils/ag-grid/cells";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";

export const getDataPath = (data: { uniqueIds: string[] }) => data.uniqueIds;
export const getRowId = (data: { uniqueIds: string[] }) =>
  data.uniqueIds.join("-");

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

export const marketCapOptimizedDefaultColumn = {
  flex: 1,
  minWidth: 70,
  cellStyle: defaultStyle,
  resizable: true,
  headerClass: "dockview-table-header",
};

export const createMarketCapDistributionOptimizedColumns = (
  metricsCatalog: MetricCatalogItem[],
  metricNames: string[]
): ColDef[] => {
  return metricNames.map((key) => {
    const metric = metricsCatalog.find((m) => m.name === key);

    return {
      colId: metric?.name,
      headerName: metric?.display_name,
      headerTooltip: metric?.description || metric?.display_name,
      field: metric?.name,
      resizable: true,
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

export const buildAutoGroupColumnDef = (
  groupingFields: string[],
  metricsCatalog: MetricCatalogItem[],
  minWidth: number = 70
): ColDef => {
  const headerName =
    metricsCatalog.find((m) => m.name === groupingFields[0])?.display_name ||
    groupingFields[0];

  const headerTooltip =
    metricsCatalog.find((m) => m.name === groupingFields[0])?.description ||
    groupingFields[0];

  return {
    flex: 1,
    minWidth,
    headerName: headerName || "Group",
    headerTooltip: headerTooltip || undefined,
    headerClass: "scalable-table-header",
    resizable: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  };
};

export const defaultDataGridProps = {
  flex: 1,
  minWidth: 150,
  defaultColDef: marketCapOptimizedDefaultColumn,
  sideBar: false,
  groupDefaultExpanded: -1,
  suppressAggFuncInHeader: true,
  treeData: true,
  animateRows: false,
};
