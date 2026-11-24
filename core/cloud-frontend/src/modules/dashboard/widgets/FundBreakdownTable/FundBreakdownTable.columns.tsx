import {
  MetricDisplayType,
  MetricCatalogItem as MetricCatalogItem,
} from "@api/types/index";
import { cellColor } from "@/utils/ag-grid/cells";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import { ColDef, SizeColumnsToFitGridStrategy } from "@ag-grid-community/core";
import { getMetricData } from "../CoverageUniverse/helpers/getMetricData";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";

interface FundBreakdownResponse {
  name: string;
  value: number;
  company_security_code_portfolio_asset_class: string;
}
const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

export const autoSizeStrategy: SizeColumnsToFitGridStrategy = {
  type: "fitGridWidth",
};

export const fundBreakdownDefaultColumn = {
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

export const defaultDataGridProps = {
  defaultColDef: fundBreakdownDefaultColumn,
  sideBar: false,
  groupDefaultExpanded: 0,
  suppressAggFuncInHeader: true,
  treeData: true,
  animateRows: false,
};

export const getFundBreakdownAutoGroupColumn = (
  metricsCatalog: Array<MetricCatalogItem>
) => {
  return {
    flex: 1,
    headerName: "Name",
    headerTooltip: getMetricData(
      metricsCatalog,
      "company_security_code_portfolio_asset_class"
    )?.description,
    resizable: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  };
};

export const getFundBreakdownColumnMap = (
  metricsCatalog: Array<MetricCatalogItem>
) => {
  return {
    exposure: {
      colId: "value",
      headerName: "Exp",
      field: "value",
      headerTooltip: getMetricData(metricsCatalog, "net_exposure_percent")
        ?.description,
      valueFormatter: (params) => {
        return formatMetric(params.data?.value, MetricDisplayType.percent);
      },
      cellStyle: (params) => {
        const status = getValueStatusForMetric({
          value: params.data?.value,
          metric: {
            display_type: MetricDisplayType.percent,
          },
        });

        return {
          ...defaultStyle,
          color: cellColor[status],
        };
      },
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      ...createFullPrecisionPercentTooltipProps({
        display_type: MetricDisplayType.percent,
      }),
    } as ColDef<FundBreakdownResponse>,
  };
};

export const getFundBreakdownGroupedColumns = (
  metricsCatalog: Array<MetricCatalogItem>
): ColDef<FundBreakdownResponse>[] => [
  getFundBreakdownColumnMap(metricsCatalog).exposure,
];

export const getFundBreakdownNonGroupedColumns = (
  metricsCatalog: Array<MetricCatalogItem>
): ColDef<FundBreakdownResponse>[] => [
  getFundBreakdownColumnMap(metricsCatalog).exposure,
];
