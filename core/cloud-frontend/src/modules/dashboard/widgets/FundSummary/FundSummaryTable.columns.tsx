import { MetricDisplayType, MetricCatalogItem } from "@api/types/index";
import { cellColor } from "@/utils/ag-grid/cells";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import { ColDef } from "@ag-grid-community/core";
import { FundSummaryRow } from "./FundSummaryTable.utils";
import { getMetricData } from "../CoverageUniverse/helpers/getMetricData";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";

interface FundSummaryResponse {
  name: string;
  value: number;
}

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

export const fundSummaryDefaultColumn = {
  flex: 1,
  minWidth: 70,
  cellStyle: defaultStyle,
  resizable: false,
  headerClass: "dockview-table-header",
};

export const defaultDataGridProps = {
  defaultColDef: fundSummaryDefaultColumn,
  sideBar: false,
  suppressAggFuncInHeader: true,
  animateRows: false,
};

export const FundSummaryAutoGroupColumn: ColDef<FundSummaryRow> = {
  flex: 1,
  headerName: "Name",
  field: "name" as keyof FundSummaryRow,
  resizable: true,
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
};

const getMetricDisplayType = (name: string | undefined) =>
  name === "NAV" ? MetricDisplayType.dollars : MetricDisplayType.percent;

export const getFundSummaryColumnMap = (
  metricsCatalog: Array<MetricCatalogItem>
) => {
  return {
    value: {
      colId: "value",
      headerName: "Value",
      field: "value" as keyof FundSummaryResponse,
      headerTooltip: getMetricData(metricsCatalog, "cumulative_pnl_percent_nav")
        ?.description,
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

        return {
          ...defaultStyle,
          color: cellColor[status],
        };
      },
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      tooltipValueGetter: (params) => {
        const metric = {
          display_type: getMetricDisplayType(params.data?.name),
        };
        const tooltipProps = createFullPrecisionPercentTooltipProps(metric);
        return tooltipProps.tooltipValueGetter?.(params) || "";
      },
    } as ColDef<FundSummaryRow>,
  };
};

export const getFundSummaryColumns = (
  metricsCatalog: Array<MetricCatalogItem>
): ColDef<FundSummaryRow>[] => [
  FundSummaryAutoGroupColumn,
  getFundSummaryColumnMap(metricsCatalog).value,
];
