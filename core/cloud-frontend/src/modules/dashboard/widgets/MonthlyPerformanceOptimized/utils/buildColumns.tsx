import {
  ColDef,
  SizeColumnsToContentStrategy,
  ValueFormatterParams,
} from "@ag-grid-community/core";
import { MetricDisplayType } from "@api/types/index";
import { cellColor } from "@/utils/ag-grid/cells";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";
import { Avatar } from "@components/Avatar";

const MONTH_PATTERN = /^[A-Za-z]{3} \d{4}$/;

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

export const defaultColDef = {
  flex: 1,
  minWidth: 80,
  cellStyle: defaultStyle,
  resizable: false,
  headerClass: "dockview-table-header right-pinned",
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
};

export const defaultGridProps = {
  defaultColDef,
  sideBar: false,
  suppressAggFuncInHeader: true,
  animateRows: false,
};

export const autoSizeStrategy: SizeColumnsToContentStrategy = {
  type: "fitCellContents",
};

export const buildMonthlyPerformanceColumns = (
  groupByKey: string,
  displayColumns: string[],
  groupByDisplayName?: string,
  groupByDescription?: string
): ColDef[] => {
  const groupByColumn: ColDef = {
    colId: groupByKey,
    headerName: groupByDisplayName || groupByKey,
    headerTooltip: groupByDescription || groupByDisplayName || groupByKey,
    resizable: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    valueGetter: (params) => params.data?.[groupByKey],
    valueFormatter: (params: ValueFormatterParams) => params.value ?? "-",
    cellRenderer:
      groupByKey === "primary_analyst"
        ? (params: ValueFormatterParams) => {
            if (!params.data?.primary_analyst_avatar) return "-";
            const raw = String(params.data.primary_analyst_avatar);
            const [email, first_name, last_name] = raw.split("|");
            return (
              <div className="flex justify-center w-full">
                <Avatar data={{ email, first_name, last_name }} />
              </div>
            );
          }
        : undefined,
  };

  const dataColumns = displayColumns.filter(
    (col) => col !== groupByKey && col !== "primary_analyst_avatar"
  );
  const monthColumns = dataColumns.filter((col) => MONTH_PATTERN.test(col));
  const totalColumns = dataColumns.filter((col) => !MONTH_PATTERN.test(col));

  const metricDisplayType = MetricDisplayType.percent;
  const metricTooltipProps = createFullPrecisionPercentTooltipProps({
    display_type: metricDisplayType,
  });

  const buildValueColumn = (
    col: string,
    extra: Partial<ColDef> = {}
  ): ColDef => ({
    colId: col,
    headerName: col,
    headerTooltip: col,
    resizable: true,
    valueGetter: (params) => params.data?.[col],
    valueFormatter: (params: ValueFormatterParams) =>
      params.value != null
        ? formatMetric(params.value as number, metricDisplayType)
        : "-",
    cellStyle: (params: ValueFormatterParams) => {
      const status = getValueStatusForMetric({
        value: params.value,
        metric: { display_type: metricDisplayType },
      });
      return { ...defaultStyle, color: cellColor[status] };
    },
    ...metricTooltipProps,
    ...extra,
  });

  const monthColDefs = monthColumns.map((col) => buildValueColumn(col));

  const totalColDefs = totalColumns.map((col) =>
    buildValueColumn(col, {
      pinned: "right" as const,
      lockPinned: true,
      cellClass: "right-pinned",
      maxWidth: undefined,
    })
  );

  return [groupByColumn, ...monthColDefs, ...totalColDefs];
};
