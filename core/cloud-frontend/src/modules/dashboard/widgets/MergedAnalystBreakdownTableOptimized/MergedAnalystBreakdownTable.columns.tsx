import {
  ColDef,
  ICellRendererParams,
  ValueFormatterParams,
} from "@ag-grid-community/core";
import { MetricCatalogItem } from "@api/types";
import { Avatar } from "@/components/Avatar";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import { cellColor } from "@/utils/ag-grid/cells";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

const mergedAnalystDefaultColumn = {
  flex: 1,
  minWidth: 70,
  cellStyle: defaultStyle,
  resizable: true,
  headerClass: "dockview-table-header",
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
};

export const defaultDataGridProps = {
  defaultColDef: mergedAnalystDefaultColumn,
  sideBar: false,
  groupDefaultExpanded: -1,
  suppressAggFuncInHeader: true,
  animateRows: false,
};

const createAvatarColumn = (
  colName: string,
  metric?: MetricCatalogItem
): ColDef<Record<string, unknown>> => ({
  colId: colName,
  headerName: metric?.display_name ?? "Analyst",
  field: colName,
  width: 66,
  maxWidth: 66,
  cellRenderer: (params: ICellRendererParams<Record<string, unknown>>) => {
    const avatarData = params.data?.[colName];
    if (!avatarData) return "-";
    const [email = "", first_name = "", last_name = ""] =
      String(avatarData).split("|");
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Avatar data={{ email, first_name, last_name }} />
      </div>
    );
  },
});

const createMetricColumn = (
  colName: string,
  metric?: MetricCatalogItem
): ColDef<Record<string, unknown>> => ({
  colId: colName,
  headerName: metric?.display_name ?? colName,
  headerTooltip: metric?.description ?? metric?.display_name ?? colName,
  field: colName,
  valueFormatter: (params: ValueFormatterParams<Record<string, unknown>>) =>
    metric?.display_type
      ? formatMetric(params.value, metric.display_type)
      : String(params.value ?? ""),
  cellStyle: (params: ValueFormatterParams<Record<string, unknown>>) => ({
    ...defaultStyle,
    color:
      cellColor[
        getValueStatusForMetric({
          value: params.value,
          metric: metric,
        })
      ],
  }),
  ...createFullPrecisionPercentTooltipProps(metric),
});

export const createMergedAnalystColumns = (
  displayColumns: string[],
  groupByColumns: string[],
  metricsCatalog: MetricCatalogItem[]
): ColDef<Record<string, unknown>>[] => {
  return displayColumns
    .filter((col) => !groupByColumns.includes(col))
    .map((col) => {
      const metric = metricsCatalog.find((m) => m.name === col);
      if (col.endsWith("_avatar")) {
        return createAvatarColumn(col, metric);
      }
      return createMetricColumn(col, metric);
    });
};
