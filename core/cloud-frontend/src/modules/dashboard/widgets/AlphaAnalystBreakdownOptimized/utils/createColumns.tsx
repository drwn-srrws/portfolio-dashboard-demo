import type {
  ColDef,
  ICellRendererParams,
  ValueFormatterParams,
} from "@ag-grid-community/core";

import { Avatar } from "@/components/Avatar";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import { cellColor } from "@/utils/ag-grid/cells";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";
import {
  MetricDisplayType,
  type PortfolioMetricCatalogItem,
} from "@/api/types";

const defaultStyle = {
  display: "flex",
  height: "100%",
  alignItems: "center",
};

const alphaAnalystDefaultColumn = {
  flex: 1,
  minWidth: 70,
  cellStyle: defaultStyle,
  resizable: true,
  headerClass: "dockview-table-header",
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
};

export const defaultDataGridProps = {
  defaultColDef: alphaAnalystDefaultColumn,
  sideBar: false,
  groupDefaultExpanded: -1,
  suppressAggFuncInHeader: true,
  animateRows: false,
};

const isAlphaColumn = (colName: string) => colName.startsWith("Alpha (vs ");
const isPnlColumn = (colName: string) => colName.toLowerCase().includes("pnl");
const isPercentLikeColumn = (colName: string) =>
  colName.includes("%") || colName.toLowerCase().includes("percent");

const getSignedStatus = (
  value: unknown
): "positive" | "negative" | "neutral" => {
  if (typeof value === "number") {
    if (value > 0) return "positive";
    if (value < 0) return "negative";
    return "neutral";
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.startsWith("+")) return "positive";
    if (trimmed.startsWith("-")) return "negative";

    const isParenNegative = trimmed.startsWith("(") && trimmed.endsWith(")");
    const normalized = trimmed
      .replaceAll(",", "")
      .replaceAll("$", "")
      .replaceAll("%", "")
      .replaceAll("(", "")
      .replaceAll(")", "");

    const parsed = Number(normalized);

    if (!Number.isFinite(parsed)) return "neutral";
    const signed = isParenNegative ? -Math.abs(parsed) : parsed;

    if (signed > 0) return "positive";
    if (signed < 0) return "negative";
  }

  return "neutral";
};

const isSupportedDisplayType = (
  displayType: unknown
): displayType is MetricDisplayType | "dollars_regular" => {
  if (displayType === "dollars_regular") return true;
  return (
    typeof displayType === "string" &&
    (Object.values(MetricDisplayType) as string[]).includes(displayType)
  );
};

const createAvatarColumn = (
  colName: string,
  metric?: PortfolioMetricCatalogItem
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

const createTextColumn = (
  colName: string,
  metric?: PortfolioMetricCatalogItem
): ColDef<Record<string, unknown>> => ({
  colId: colName,
  headerName: metric?.display_name ?? colName,
  headerTooltip: metric?.description ?? metric?.display_name ?? colName,
  field: colName,
});

const createMetricColumn = (
  colName: string,
  metric?: PortfolioMetricCatalogItem
): ColDef<Record<string, unknown>> => ({
  colId: colName,
  headerName: metric?.display_name ?? colName,
  headerTooltip: metric?.description ?? metric?.display_name ?? colName,
  field: colName,
  minWidth: isAlphaColumn(colName) ? 110 : 87,
  maxWidth: isAlphaColumn(colName) ? 150 : 120,
  valueFormatter: (params: ValueFormatterParams<Record<string, unknown>>) => {
    if (metric?.display_type && isSupportedDisplayType(metric.display_type)) {
      return formatMetric(params.value, metric.display_type);
    }
    if (isAlphaColumn(colName)) {
      return formatMetric(params.value, MetricDisplayType.percent);
    }
    if (typeof params.value === "number") {
      return formatMetric(params.value, MetricDisplayType.float);
    }
    return String(params.value ?? "");
  },
  cellStyle: (params: { value?: unknown; data?: Record<string, unknown> }) => {
    const metricDisplayType =
      metric?.display_type && isSupportedDisplayType(metric.display_type)
        ? metric.display_type
        : undefined;

    const displayTypeForStatus: MetricDisplayType | undefined = isAlphaColumn(
      colName
    )
      ? MetricDisplayType.percent
      : isPnlColumn(colName) &&
          !isPercentLikeColumn(colName) &&
          (metricDisplayType === undefined ||
            metricDisplayType === "dollars_regular" ||
            metricDisplayType === MetricDisplayType.dollars ||
            metricDisplayType === MetricDisplayType.pnl)
        ? MetricDisplayType.pnl
        : typeof metricDisplayType === "string" &&
            (Object.values(MetricDisplayType) as string[]).includes(
              metricDisplayType
            )
          ? (metricDisplayType as MetricDisplayType)
          : undefined;

    const rawValue = params.data?.[colName] ?? params.value;
    const valueStatus =
      displayTypeForStatus === MetricDisplayType.pnl
        ? getSignedStatus(rawValue) === "neutral"
          ? getValueStatusForMetric({
              value: rawValue,
              metric: { display_type: MetricDisplayType.pnl },
            })
          : getSignedStatus(rawValue)
        : getValueStatusForMetric({
            value: rawValue,
            metric: displayTypeForStatus
              ? { display_type: displayTypeForStatus }
              : undefined,
          });

    return {
      ...defaultStyle,
      color: cellColor[valueStatus],
    };
  },
  ...(isAlphaColumn(colName)
    ? createFullPrecisionPercentTooltipProps({
        display_type: MetricDisplayType.percent,
      })
    : createFullPrecisionPercentTooltipProps(
        typeof metric?.display_type === "string" &&
          metric.display_type === MetricDisplayType.percent
          ? { display_type: MetricDisplayType.percent }
          : undefined
      )),
});

export const createAlphaAnalystBreakdownColumns = (
  displayColumns: string[],
  metricsCatalog: PortfolioMetricCatalogItem[]
): ColDef<Record<string, unknown>>[] => {
  return displayColumns.map((col) => {
    const metric = metricsCatalog.find((m) => m.name === col);
    if (col.endsWith("_avatar")) {
      return createAvatarColumn(col, metric);
    }
    if (col.endsWith("_analyst")) {
      return createTextColumn(col, metric);
    }
    return createMetricColumn(col, metric);
  });
};
