import { MetricCatalogItem, MetricResult } from "@api/types/index";
import { cellColor } from "@/utils/ag-grid/cells";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import {
  ColDef,
  SizeColumnsToFitGridStrategy,
  ValueFormatterParams,
} from "@ag-grid-community/core";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";

interface MarketCapResponse {
  company_netted_gmv_percent_nav: number;
  instrument_group: string;
}

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

export const marketCapAutoGroupColumn = {
  flex: 1,
  minWidth: 70,
  headerName: "Instrument Group",
  resizable: false,
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
} as ColDef<MarketCapResponse>;

export const marketCapDefaultColumn = {
  flex: 1,
  minWidth: 70,
  cellStyle: {
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
  resizable: false,
  headerClass: "dockview-table-header",
};

export const createMarketCapDistributionColumns = (
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
      resizable: false,
      suppressHeaderMenuButton: true,
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
  defaultColDef: marketCapDefaultColumn,
  sideBar: false,
  groupDefaultExpanded: -1,
  suppressAggFuncInHeader: true,
  treeData: true,
  animateRows: false,
};
