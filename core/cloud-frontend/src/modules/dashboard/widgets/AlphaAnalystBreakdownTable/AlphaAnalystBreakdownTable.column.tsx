import { MetricCatalogItem, MetricDisplayType } from "@api/types/index";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import { cellColor } from "@/utils/ag-grid/cells";

import { AnalystBreakdownData } from "./AlphaAnalystBreakdownTable.utils";
import { Avatar } from "@/components/Avatar";
import { ColDef, ValueFormatterParams } from "@ag-grid-community/core";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

export const analystBreakdownDefaultColumn = {
  flex: 1,
  maxWidth: 85,
  cellStyle: defaultStyle,
  resizable: false,
  headerClass: "scalable-table-header",
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
};

export const defaultDataGridProps = {
  defaultColDef: analystBreakdownDefaultColumn,
  sideBar: false,
  groupDefaultExpanded: -1,
  suppressAggFuncInHeader: true,
  animateRows: false,
};

const createAnalystAvatarColumns = (
  metricsCatalog: MetricCatalogItem[]
): ColDef<AnalystBreakdownData>[] => {
  const avatarColumns = metricsCatalog
    .filter(
      (metric) =>
        metric.name.includes("primary_analyst_avatar") ||
        metric.name.includes("secondary_analyst_avatar")
    )
    .map((metric) => {
      const isPrimary = metric.name.includes("primary_analyst_avatar");
      const fieldName = isPrimary
        ? "primary_analyst_avatar"
        : "secondary_analyst_avatar";

      return {
        colId: fieldName,
        headerName: metric.display_name || metric.name,
        headerTooltip: metric.description || metric.display_name,
        field: fieldName,
        cellRenderer: (params: ValueFormatterParams<AnalystBreakdownData>) => {
          const avatarData = params.data?.[fieldName];

          if (!avatarData) {
            return "-";
          }

          const avatarString = String(avatarData);
          const [email, first_name, last_name] = avatarString.split("|");

          return (
            <div className="flex justify-center items-center w-full h-full">
              <Avatar data={{ email, first_name, last_name }} />
            </div>
          );
        },
      } as ColDef<AnalystBreakdownData>;
    });

  return avatarColumns;
};

const createMetricColumns = (
  metricsCatalog: MetricCatalogItem[]
): ColDef<AnalystBreakdownData>[] => {
  const metricColumns = metricsCatalog
    .filter(
      (metric) =>
        metric.name !== "cumulative_alpha_pnl_percent" &&
        !metric.name.includes("analyst")
    )
    .map(
      (metric) =>
        ({
          colId: metric.name,
          headerName: metric.display_name || metric.name,
          headerTooltip: metric.description || metric.display_name,
          field: metric.name,
          filter: "agTextColumnFilter",
          valueFormatter: (params) =>
            formatMetric(params.value, metric.display_type),
          cellStyle: (params) => ({
            ...defaultStyle,
            color:
              cellColor[
                getValueStatusForMetric({
                  value: params.value,
                  metric: {
                    display_type: metric.display_type,
                  },
                })
              ],
          }),
          ...createFullPrecisionPercentTooltipProps({
            display_type: metric.display_type,
          }),
        }) as ColDef<AnalystBreakdownData>
    );

  return metricColumns;
};

const getBenchmarkShortName = (benchmarkId: string): string => {
  const benchmarkMap: Record<string, string> = {
    "XBI US Equity": "XBI US",
    "NBI Index": "NBI",
    "RGUSHSBT Index": "RGUSHSBT",
    "XHE US Equity": "XHE US",
    "RGUSHSME Index": "RGUSHSME",
    "DJSMDQT Index": "DJSMDQT",
  };
  return benchmarkMap[benchmarkId] || benchmarkId;
};

const createBenchmarkColumns = (
  benchmarkIds: string[]
): ColDef<AnalystBreakdownData>[] => {
  const benchmarkColumns = benchmarkIds.map(
    (benchmarkId) =>
      ({
        colId: benchmarkId,
        headerName: `Alpha (vs ${getBenchmarkShortName(benchmarkId)})`,
        headerTooltip: `Alpha (vs ${benchmarkId})`,
        field: benchmarkId,
        valueFormatter: (params) =>
          formatMetric(params.value, MetricDisplayType.percent),
        cellStyle: (params) => ({
          ...defaultStyle,
          color:
            cellColor[
              getValueStatusForMetric({
                value: params.value,
                metric: { display_type: MetricDisplayType.percent },
              })
            ],
        }),
        ...createFullPrecisionPercentTooltipProps({
          display_type: MetricDisplayType.percent,
        }),
      }) as ColDef<AnalystBreakdownData>
  );

  return benchmarkColumns;
};

export const getAvailableColumnIds = (
  metricsCatalog: MetricCatalogItem[],
  benchmarkIds: string[]
): string[] => {
  const avatarColumns = createAnalystAvatarColumns(metricsCatalog);
  const metricColumns = createMetricColumns(metricsCatalog);
  const benchmarkColumns = createBenchmarkColumns(benchmarkIds);

  const allColumns = [...avatarColumns, ...metricColumns, ...benchmarkColumns];

  return allColumns
    .map((column) => column.colId || column.field || "")
    .filter(Boolean);
};

export const createDynamicAnalystBreakdownColumns = (
  metricsCatalog: MetricCatalogItem[],
  benchmarkIds: string[],
  columnOrder?: string[]
): ColDef<AnalystBreakdownData>[] => {
  const avatarColumns = createAnalystAvatarColumns(metricsCatalog);
  const metricColumns = createMetricColumns(metricsCatalog);
  const benchmarkColumns = createBenchmarkColumns(benchmarkIds);

  const allColumns = [...avatarColumns, ...metricColumns, ...benchmarkColumns];

  if (!columnOrder) {
    return allColumns;
  }

  const columnMap = new Map<string, ColDef<AnalystBreakdownData>>();
  allColumns.forEach((column) => {
    const key = column.colId || column.field || "";
    columnMap.set(key, column);
  });

  return columnOrder
    .map((columnId) => columnMap.get(columnId))
    .filter(
      (column): column is ColDef<AnalystBreakdownData> => column !== undefined
    );
};
