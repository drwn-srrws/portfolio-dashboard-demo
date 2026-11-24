import { ColDef, ValueFormatterParams } from "@ag-grid-community/core";

import {
  MetricCatalogItem,
  MetricDisplayType,
  MetricResult,
  MetricResultDataAnyOfItem,
} from "@api/types/index";
import { cellColor } from "@/utils/ag-grid/cells";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";
import { Selectable } from "@/typings/Selectable";
import { AnalystAvatarRenderer } from "../AnalystAvatarRenderer";

export interface PortfolioSummaryTableRow extends MetricResultDataAnyOfItem {
  [key: string]: unknown;
  uniqueIds: string[];
}

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

const portofolioSummaryColumnMap = {
  primary_analyst_avatar: {
    colId: "primary_analyst_avatar",
    headerName: "1° Analyst",
    field: "primary_analyst_avatar",
    suppressHeaderMenuButton: true,
    resizable: true,
    maxWidth: 85,
    cellRenderer: (params: ValueFormatterParams<MetricResultDataAnyOfItem>) => {
      if (!params || !params.data?.primary_analyst_avatar) return "";
      return (
        <AnalystAvatarRenderer
          analystString={String(params.data.primary_analyst_avatar)}
        />
      );
    },
  },
  primary_analyst_avatars: {
    colId: "primary_analyst_avatars",
    headerName: "1° Analyst",
    field: "primary_analyst_avatars",
    suppressHeaderMenuButton: true,
    resizable: true,
    maxWidth: 85,
    cellRenderer: (params: ValueFormatterParams<MetricResultDataAnyOfItem>) => {
      if (!params || !params.data?.primary_analyst_avatars) return "";
      return (
        <AnalystAvatarRenderer
          analystString={String(params.data.primary_analyst_avatars)}
        />
      );
    },
  },
  secondary_analyst_avatars: {
    colId: "secondary_analyst_avatars",
    headerName: "2° Analyst",
    field: "secondary_analyst_avatars",
    suppressHeaderMenuButton: true,
    resizable: true,
    maxWidth: 85,
    cellRenderer: (params: ValueFormatterParams<MetricResultDataAnyOfItem>) => {
      if (!params || !params.data?.secondary_analyst_avatars) return "";
      return (
        <AnalystAvatarRenderer
          analystString={String(params.data.secondary_analyst_avatars)}
        />
      );
    },
  },
};

export const createPortfolioSummaryColumns = (
  selectedMetrics: Array<MetricCatalogItem>,
  columnsOrder: Selectable["value"][]
): Array<ColDef<PortfolioSummaryTableRow>> => {
  return columnsOrder.map((key) => {
    const metric = selectedMetrics.find((metric) => metric.name === key);

    const column =
      portofolioSummaryColumnMap[
        key as keyof typeof portofolioSummaryColumnMap
      ];

    if (column) {
      return {
        ...column,
        headerTooltip: metric?.description || column.headerName,
      };
    }

    const minWidth =
      metric?.display_type === MetricDisplayType.percent ||
      metric?.display_type === MetricDisplayType.pnl
        ? 70
        : undefined;

    return {
      colId: metric?.name,
      headerName: metric?.display_name,
      headerTooltip: metric?.description || metric?.display_name,
      field: metric?.name,
      resizable: true,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      minWidth,
      headerClass: "scalable-table-header",
      valueFormatter: (params: ValueFormatterParams<MetricResult>) => {
        if (!metric?.display_type) return "";

        const displayType =
          metric.name === "average_cost"
            ? "dollars_regular"
            : metric.display_type;

        return formatMetric(params.value, displayType);
      },
      ...createFullPrecisionPercentTooltipProps(metric),
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
    } as ColDef;
  });
};

export const createAutoGroupColumnDef = (
  groupByFieldName?: string,
  groupByFieldDescription?: string
) => ({
  minWidth: 150,
  headerName: `${groupByFieldName ?? "Group"}`,
  headerTooltip: groupByFieldDescription ?? "",
  resizable: true,
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
  cellRendererParams: {
    suppressCount: true,
  },
  valueFormatter: (params: ValueFormatterParams<PortfolioSummaryTableRow>) => {
    const value = params.value;
    const count = params.node?.childrenAfterGroup?.length;
    const label = count ? `${value} (${count})` : value;

    return label;
  },
});
