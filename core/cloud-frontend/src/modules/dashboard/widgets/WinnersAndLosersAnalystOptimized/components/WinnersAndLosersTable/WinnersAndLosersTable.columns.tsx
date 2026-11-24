import {
  SizeColumnsToFitGridStrategy,
  ValueFormatterParams,
  ICellRendererParams,
} from "@ag-grid-community/core";

import { MetricCatalogItem } from "@api/types/index";
import { cellColor } from "@utils/ag-grid/cells";
import { formatMetric, getValueStatusForMetric } from "@utils/metrics";
import { createFullPrecisionPercentTooltipProps } from "@utils/ag-grid/tooltips";
import { Avatar } from "@components/Avatar";

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

export const createWinnersAndLosersColumns = (
  selectedMetrics: Array<MetricCatalogItem>,
  columnsOrder: string[],
  decimalPrecision: number = 2,
  groupBy?: string
) => {
  const groupByColumn = groupBy
    ? {
        colId: groupBy,
        headerName:
          selectedMetrics.find((m) => m.name === groupBy)?.display_name ||
          groupBy,
        headerTooltip:
          selectedMetrics.find((m) => m.name === groupBy)?.description ||
          selectedMetrics.find((m) => m.name === groupBy)?.display_name ||
          groupBy,
        field: groupBy,
        resizable: true,
        suppressHeaderMenuButton: true,
        suppressHeaderFilterButton: true,
        cellRenderer: (
          params: ICellRendererParams<Record<string, unknown>>
        ) => {
          if (groupBy === "primary_analyst") {
            const analystAvatar = String(
              params.data?.primary_analyst_avatar || ""
            );
            const avatarParts = analystAvatar.split("|");

            const data = {
              email: avatarParts[0] || "",
              first_name: avatarParts[1] || "",
              last_name: avatarParts[2] || "",
            };

            return (
              <div className="flex items-center p-2">
                <Avatar data={data} />
              </div>
            );
          }
          return params.value;
        },
      }
    : null;

  const metricColumns = columnsOrder.map((key) => {
    const metric = selectedMetrics.find((metric) => metric.name === key);

    return {
      colId: metric?.name,
      headerName: metric?.display_name,
      headerTooltip: metric?.description || metric?.display_name,
      field: metric?.name,
      resizable: true,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      valueFormatter: (
        params: ValueFormatterParams<Record<string, unknown>>
      ) =>
        metric?.display_type
          ? formatMetric(params.value, metric?.display_type, {
              digits: decimalPrecision,
            })
          : "",
      cellStyle: (params: ValueFormatterParams<Record<string, unknown>>) => {
        const status = getValueStatusForMetric({
          value: params.value,
          metric,
        });

        return {
          ...defaultStyle,
          color: cellColor[status],
        };
      },
      ...createFullPrecisionPercentTooltipProps(metric),
    };
  });

  return groupByColumn ? [groupByColumn, ...metricColumns] : metricColumns;
};

export const autoSizeStrategy: SizeColumnsToFitGridStrategy = {
  type: "fitGridWidth",
};
