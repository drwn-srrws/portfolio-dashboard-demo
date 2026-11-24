import { MetricCatalogItem, MetricDisplayType } from "@api/types/index";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import { cellColor } from "@/utils/ag-grid/cells";
import { truncate } from "@/utils/strings";

import { AnalystData } from "./AnalystBreakdownTable.utils";
import { Avatar } from "@/components/Avatar";
import { ColDef, ValueGetterParams } from "@ag-grid-community/core";
import { getMetricData } from "../CoverageUniverse/helpers/getMetricData";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

export const analystBreakdownDefaultColumn = {
  flex: 1,
  minWidth: 70,
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

const primaryColumns = {
  analyst_avatar: {
    headerName: "Analyst",
    field: "analystAvatar",
    filter: "agTextColumnFilter",
    colId: "analystAvatar",
    maxWidth: 70,
    cellRenderer: (params: ValueGetterParams<AnalystData>) => {
      const analystAvatar = params.data?.analystAvatar;

      if (!analystAvatar) return "-";

      const data = {
        email: analystAvatar.split("|")[0],
        first_name: analystAvatar.split("|")[1],
        last_name: analystAvatar.split("|")[2],
      };

      return (
        <div className="flex justify-center w-full">
          <Avatar data={data} />
        </div>
      );
    },
  } as ColDef<AnalystData>,
  net_exposure: {
    colId: "primaryExposure",
    headerName: "1° Exp",
    field: "primaryExposure",
    filter: "agTextColumnFilter",
    valueFormatter: (params) =>
      formatMetric(params.data?.primaryExposure, MetricDisplayType.dollars),
  } as ColDef<AnalystData>,
  cumulative_pnl_percent_nav: {
    colId: "primaryPnLPct",
    headerName: "1° PnL",
    field: "primaryPnLPct",
    filter: "agTextColumnFilter",
    valueFormatter: (params) =>
      formatMetric(params.data?.primaryPnLPct, MetricDisplayType.percent),
    cellStyle: (params) => ({
      ...defaultStyle,
      color:
        cellColor[
          getValueStatusForMetric({
            value: params.data?.primaryPnLPct,
            metric: {
              display_type: MetricDisplayType.percent,
            },
          })
        ],
    }),
    ...createFullPrecisionPercentTooltipProps({
      display_type: MetricDisplayType.percent,
    }),
  } as ColDef<AnalystData>,
};

const secondaryColumns = {
  net_exposure: {
    headerName: "2° Exp",
    field: "secondaryExposure",
    filter: "agTextColumnFilter",
    colId: "secondaryExposure",
    valueFormatter: (params) =>
      formatMetric(params.data?.secondaryExposure, MetricDisplayType.dollars),
  } as ColDef<AnalystData>,
  cumulative_pnl_percent_nav: {
    colId: "secondaryPnLPct",
    headerName: "2° PnL",
    field: "secondaryPnLPct",
    filter: "agTextColumnFilter",
    valueFormatter: (params) =>
      formatMetric(params.data?.secondaryPnLPct, MetricDisplayType.percent),
    cellStyle: (params) => ({
      ...defaultStyle,
      color:
        cellColor[
          getValueStatusForMetric({
            value: params.data?.secondaryPnLPct,
            metric: {
              display_type: MetricDisplayType.percent,
            },
          })
        ],
    }),
    ...createFullPrecisionPercentTooltipProps({
      display_type: MetricDisplayType.percent,
    }),
  } as ColDef<AnalystData>,
};

const createBenchmarkColumn = (
  benchmarkIndex: number,
  isPrimary: boolean,
  benchmarkId: string
): ColDef<AnalystData> => {
  const prefix = isPrimary ? "primary" : "secondary";
  const field = `${prefix}Benchmark${benchmarkIndex}AlphaPnlPercent`;

  return {
    colId: field,
    headerName: `Alpha (vs ${truncate(benchmarkId, 5)})`,
    headerTooltip: `Alpha (vs ${benchmarkId})`,
    field,
    minWidth: 78,
    maxWidth: 78,
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
  };
};

export const createAnalystBreakdownColumns = (
  primaryMetricsCatalog: MetricCatalogItem[],
  secondaryMetricsCatalog: MetricCatalogItem[],
  benchmarkIds: string[]
) => {
  const analystColumn = {
    ...primaryColumns.analyst_avatar,
    headerTooltip: getMetricData(
      primaryMetricsCatalog,
      "primary_analyst_avatar"
    )?.description,
  };

  return [
    analystColumn,
    ...primaryMetricsCatalog
      .filter(
        (metric) =>
          metric.name !== "primary_analyst_avatar" &&
          metric.name !== "secondary_analyst_avatar" &&
          metric.name !== "cumulative_alpha_pnl_percent"
      )
      .map((metric) => ({
        ...primaryColumns[metric.name as keyof typeof primaryColumns],
        headerTooltip: metric.description || metric.display_name,
      })),

    ...benchmarkIds.map((benchmarkId, index) =>
      createBenchmarkColumn(index, true, benchmarkId)
    ),

    ...secondaryMetricsCatalog
      .filter(
        (metric) =>
          metric.name !== "cumulative_alpha_pnl_percent" &&
          metric.name !== "secondary_analyst"
      )
      .map((metric) => ({
        ...secondaryColumns[metric.name as keyof typeof secondaryColumns],
        headerTooltip: metric.description || metric.display_name,
      })),

    ...benchmarkIds.map((benchmarkId, index) =>
      createBenchmarkColumn(index, false, benchmarkId)
    ),
  ] as ColDef<AnalystData>[];
};
