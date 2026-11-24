import {
  SizeColumnsToContentStrategy,
  ValueFormatterParams,
} from "@ag-grid-community/core";
import { format } from "date-fns";

import {
  MetricDisplayType,
  MetricResult,
  MetricResultDataAnyOfItem,
} from "@api/types/index";
import { MetricCatalogItem } from "@api/types/index";
import { cellColor } from "@/utils/ag-grid/cells";
import { parseDateString } from "@/utils/index";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import { Avatar } from "@components/Avatar";
import { MonthlyPerformanceTableRow } from "./MonthlyPerformanceTable.utils";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

export const defaultColDef = {
  flex: 1,
  minWidth: 150,
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
  groupDefaultExpanded: 0,
};

export const autoSizeStrategy: SizeColumnsToContentStrategy = {
  type: "fitCellContents",
};

export const getRowId = (row: MonthlyPerformanceTableRow) => row.id;

export const createMonthlyPerformanceColumns = (
  groupByMetric: string,
  selectedMetrics: Array<MetricCatalogItem>,
  dateRanges: { start: string; end: string }[],
  metricDisplayType: MetricDisplayType,
  catalog: MetricCatalogItem[],
  metricDescription?: string
) => {
  const columns = dateRanges.map(({ start, end }) => {
    const field = `${start}-${end}`;

    return {
      colId: field,
      field,
      headerName: `${format(parseDateString(start) || new Date(), "MMM yyyy")}`,
      resizable: true,
      maxWidth: 90,
      filter: "agNumberColumnFilter",
      headerTooltip: metricDescription || "",
      valueFormatter: (params: ValueFormatterParams<MetricResult>) => {
        return params
          ? formatMetric(params.value || 0, metricDisplayType)
          : "-";
      },
      cellStyle: (params: ValueFormatterParams<MetricResult>) => {
        const status = getValueStatusForMetric({
          value: params.value,
          metric: {
            display_type: metricDisplayType,
          },
        });

        return {
          ...defaultStyle,
          color: cellColor[status],
        };
      },
      ...createFullPrecisionPercentTooltipProps({
        display_type: metricDisplayType,
      }),
    };
  });

  const groupByDisplayName = catalog.find(
    (metric) => metric.name === groupByMetric
  )?.display_name;

  const groupByDescription = catalog.find(
    (metric) => metric.name === groupByMetric
  )?.description;

  const groupByColumn = {
    colId: groupByMetric,
    field: groupByMetric,
    maxWidth: 90,
    headerName: groupByDisplayName,
    headerTooltip: groupByDescription || groupByDisplayName || "",
    resizable: true,
    valueFormatter: (params: ValueFormatterParams<MetricResult>) => {
      return params ? params.value : "-";
    },
    cellRenderer: (params: ValueFormatterParams<MetricResultDataAnyOfItem>) => {
      if (groupByMetric === "primary_analyst") {
        if (!params.data?.primary_analyst_avatar) return "-";
        const primaryAnalystAvatar = String(
          params.data?.primary_analyst_avatar
        );

        const data = {
          email: primaryAnalystAvatar?.split("|")[0],
          first_name: primaryAnalystAvatar?.split("|")[1],
          last_name: primaryAnalystAvatar?.split("|")[2],
        };
        return (
          <div className="flex justify-center w-full">
            <Avatar data={data} />
          </div>
        );
      }

      return params ? params.value : "-";
    },
  };

  return [
    groupByColumn,
    ...columns,
    ...selectedMetrics.map((metric) => ({
      colId: metric?.name,
      headerName: metric.display_name,
      headerTooltip: metric?.description || metric?.display_name || "111",
      field: metric.name,
      resizable: false,
      pinned: "right" as const,
      lockPinned: true,
      valueFormatter: (params: ValueFormatterParams<MetricResult>) =>
        metric?.display_type
          ? formatMetric(params.value, metric?.display_type)
          : "",
      cellClass: "right-pinned",
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
      ...createFullPrecisionPercentTooltipProps(metric),
    })),
  ];
};
