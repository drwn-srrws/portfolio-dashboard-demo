import {
  MetricDisplayType,
  PortfolioMetricCatalogItem as MetricCatalogItem,
} from "@api/types/index";
import { cellColor } from "@/utils/ag-grid/cells";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import {
  ColDef,
  ColGroupDef,
  ValueFormatterParams,
} from "@ag-grid-community/core";
import { AlphaAnalysisRow } from "./AlphaAnalysisTable.utils";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";

const toMetricDisplayType = (
  raw: MetricCatalogItem["display_type"] | undefined,
  fallback: MetricDisplayType
): MetricDisplayType =>
  Object.values(MetricDisplayType).includes(raw as MetricDisplayType)
    ? (raw as MetricDisplayType)
    : fallback;

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
};

const baseColumnProps = {
  resizable: true,
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
  cellStyle: defaultStyle,
};

export const AlphaAnalysisDefaultColumn = {
  flex: 1,
  minWidth: 45,
  cellStyle: defaultStyle,
  resizable: true,
  headerClass: "scalable-table-header",
};

export const defaultDataGridProps = {
  defaultColDef: AlphaAnalysisDefaultColumn,
  sideBar: false,
  suppressAggFuncInHeader: true,
  animateRows: false,
  groupHeaderHeight: 30,
  headerHeight: 30,
};

const getBenchmarkShortName = (benchmarkId: string): string => {
  const knownMappings: Record<string, string> = {
    "SPX Index": "SPX",
    "CCMP Index": "CCMP",
    "IWM US Equity": "IWM US",
    "RGUSHSBT Index": "RGUSHSBT",
    "XBI US Equity": "XBI US",
    "NBI Index": "NBI",
    "DRG Index": "DRG",
    "DJSMDQT Index": "DJSMDQT",
    "RGUSHSME Index": "RGUSHSME",
    "XHE US Equity": "XHE US",
  };

  return knownMappings[benchmarkId] || benchmarkId;
};

export const createAlphaAnalysisColumns = (
  metricsCatalog: MetricCatalogItem[],
  defaultMetrics: string[],
  selectedBenchmarkId: string
): ColDef<AlphaAnalysisRow>[] => {
  const benchmarkShortName = getBenchmarkShortName(selectedBenchmarkId);

  return defaultMetrics.map((metricName) => {
    const raw = metricsCatalog.find((m) => m.name === metricName);
    const displayType = toMetricDisplayType(
      raw?.display_type,
      MetricDisplayType.percent
    );
    const metric = raw ? { display_type: displayType } : undefined;

    const headerName =
      metricName === "cumulative_benchmark_pnl_percent"
        ? `${benchmarkShortName} RTN`
        : raw?.display_name;

    return {
      ...baseColumnProps,
      field: metricName,
      colId: raw?.name,
      headerName,
      headerTooltip: raw?.description ?? raw?.display_name,
      valueFormatter: (params: ValueFormatterParams<AlphaAnalysisRow>) => {
        return formatMetric(params.value, displayType);
      },
      cellStyle: (params: ValueFormatterParams<AlphaAnalysisRow>) => {
        const status = getValueStatusForMetric({
          value: params.value,
          metric,
        });

        return {
          ...defaultStyle,
          color: cellColor[status],
        };
      },
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      ...createFullPrecisionPercentTooltipProps(
        metric as { display_type?: MetricDisplayType }
      ),
    } as ColDef<AlphaAnalysisRow>;
  });
};

const createMetricColumn = (
  field: string,
  metricsCatalog: MetricCatalogItem[],
  metricName: string,
  headerName: string,
  headerTooltip: string,
  maxWidth?: number,
  alignDataLeft?: boolean
): ColDef<AlphaAnalysisRow> => {
  const raw = metricsCatalog.find((m) => m.name === metricName);
  const displayType = toMetricDisplayType(
    raw?.display_type,
    MetricDisplayType.percent
  );
  const metric = raw ? { display_type: displayType } : undefined;

  return {
    ...baseColumnProps,
    field,
    colId: field,
    headerName,
    headerTooltip,
    maxWidth,
    resizable: false,
    headerClass: "scalable-table-header alpha-analysis-child-header",
    valueFormatter: (params: ValueFormatterParams<AlphaAnalysisRow>) => {
      return formatMetric(params.value, displayType);
    },
    cellStyle: (params: ValueFormatterParams<AlphaAnalysisRow>) => {
      const status = getValueStatusForMetric({
        value: params.value,
        metric,
      });
      return {
        ...defaultStyle,
        justifyContent: alignDataLeft
          ? "flex-start"
          : defaultStyle.justifyContent,
        color: cellColor[status],
      };
    },
    comparator: (valueA: number, valueB: number) => valueA - valueB,
  };
};

const getBenchmarkColumnConfig = (
  benchmarkId: string,
  benchmarkMetric?: MetricCatalogItem,
  simpleAlphaMetric?: MetricCatalogItem,
  netAdjAlphaMetric?: MetricCatalogItem
) => {
  const shortName = getBenchmarkShortName(benchmarkId);
  return {
    shortName,
    return: {
      field: `${benchmarkId}_cumulative_benchmark_pnl_percent`,
      header: `${shortName} RTN`,
      tooltip: benchmarkMetric?.description || benchmarkMetric?.display_name,
    },
    simpleAlpha: {
      field: `${benchmarkId}_cumulative_simple_alpha_pnl_percent_nav`,
      header: `ALPHA SIMPLE (% NAV) (VS ${shortName})`,
      tooltip:
        simpleAlphaMetric?.description || simpleAlphaMetric?.display_name,
    },
    netAdjAlpha: {
      field: `${benchmarkId}_cumulative_net_adjusted_alpha_pnl_percent_nav`,
      header: `ALPHA NET ADJ (% NAV) (VS ${shortName})`,
      tooltip:
        netAdjAlphaMetric?.description || netAdjAlphaMetric?.display_name,
    },
  };
};

export const createMultiBenchmarkColumns = (
  metricsCatalog: MetricCatalogItem[],
  benchmarks: Array<{ id: string; displayName: string }>
): (ColDef<AlphaAnalysisRow> | ColGroupDef<AlphaAnalysisRow>)[] => {
  const columns: (ColDef<AlphaAnalysisRow> | ColGroupDef<AlphaAnalysisRow>)[] =
    [];

  const pnlMetric = metricsCatalog.find(
    (m) => m.name === "cumulative_pnl_percent_nav"
  );
  const benchmarkMetric = metricsCatalog.find(
    (m) => m.name === "cumulative_benchmark_pnl_percent"
  );
  const simpleAlphaMetric = metricsCatalog.find(
    (m) => m.name === "cumulative_simple_alpha_pnl_percent_nav"
  );
  const netAdjAlphaMetric = metricsCatalog.find(
    (m) => m.name === "cumulative_net_adjusted_alpha_pnl_percent_nav"
  );

  if (pnlMetric) {
    const pnlColumn = createMetricColumn(
      "cumulative_pnl_percent_nav",
      metricsCatalog,
      "cumulative_pnl_percent_nav",
      pnlMetric.display_name ?? "PNL (% NAV)",
      pnlMetric.description ?? pnlMetric.display_name ?? "PNL (% NAV)",
      55
    );
    pnlColumn.headerClass =
      "scalable-table-header alpha-analysis-child-header alpha-analysis-pnl-header ag-header-span-height ag-header-span-total";
    pnlColumn.resizable = true;
    columns.push(pnlColumn);
  }

  benchmarks.forEach((benchmark) => {
    const config = getBenchmarkColumnConfig(
      benchmark.id,
      benchmarkMetric,
      simpleAlphaMetric,
      netAdjAlphaMetric
    );

    if (benchmarkMetric) {
      const rtnColumn = createMetricColumn(
        config.return.field,
        metricsCatalog,
        "cumulative_benchmark_pnl_percent",
        "(Rtn)",
        config.return.tooltip || "",
        70
      );
      rtnColumn.headerClass =
        "scalable-table-header alpha-analysis-child-header";
      rtnColumn.cellClass = "alpha-analysis-rtn-cell";

      columns.push({
        headerName: config.shortName,
        headerClass:
          "scalable-table-header ag-header-group-cell-label-center alpha-analysis-benchmark-group",
        children: [rtnColumn],
        marryChildren: true,
      } as ColGroupDef<AlphaAnalysisRow>);
    }

    const alphaColumns: ColDef<AlphaAnalysisRow>[] = [];

    if (simpleAlphaMetric) {
      const simpleColumn = createMetricColumn(
        config.simpleAlpha.field,
        metricsCatalog,
        "cumulative_simple_alpha_pnl_percent_nav",
        "Simple",
        config.simpleAlpha.tooltip || "",
        70
      );
      simpleColumn.cellClass = "alpha-analysis-alpha-first-cell";
      simpleColumn.headerClass =
        "scalable-table-header alpha-analysis-child-header";
      alphaColumns.push(simpleColumn);
    }

    if (netAdjAlphaMetric) {
      const netAdjColumn = createMetricColumn(
        config.netAdjAlpha.field,
        metricsCatalog,
        "cumulative_net_adjusted_alpha_pnl_percent_nav",
        "Net Adj",
        config.netAdjAlpha.tooltip || "",
        90
      );
      alphaColumns.push(netAdjColumn);
    }

    if (alphaColumns.length > 0) {
      columns.push({
        headerName: `Alpha (% NAV vs ${config.shortName})`,
        headerClass:
          "scalable-table-header ag-header-group-cell-label-center alpha-analysis-alpha-group",
        children: alphaColumns,
        marryChildren: true,
      } as ColGroupDef<AlphaAnalysisRow>);
    }
  });

  return columns;
};

export const createColumnsFromMetadata = (
  displayColumns: string[],
  groupByField: string,
  metricsCatalog: MetricCatalogItem[],
  alignDataLeft?: boolean
): (ColDef<AlphaAnalysisRow> | ColGroupDef<AlphaAnalysisRow>)[] => {
  const result: (ColDef<AlphaAnalysisRow> | ColGroupDef<AlphaAnalysisRow>)[] =
    [];
  const skipColumns = new Set<string>();

  const benchmarkMeta = metricsCatalog.find(
    (m) => m.name === "cumulative_benchmark_pnl_percent"
  );
  const simpleAlphaMeta = metricsCatalog.find(
    (m) => m.name === "cumulative_simple_alpha_pnl_percent_nav"
  );
  const netAdjAlphaMeta = metricsCatalog.find(
    (m) => m.name === "cumulative_net_adjusted_alpha_pnl_percent_nav"
  );

  for (const colName of displayColumns) {
    if (colName === groupByField) continue;
    if (skipColumns.has(colName)) continue;

    const rtnMatch = colName.match(/^(.+) \(RTN\)$/);
    if (rtnMatch) {
      const benchmarkId = rtnMatch[1];
      const shortName = getBenchmarkShortName(benchmarkId);
      const alphaColName = `Alpha (% NAV vs ${benchmarkId})`;
      const hasPairedAlpha = displayColumns.includes(alphaColName);

      const rtnCol = createMetricColumn(
        colName,
        metricsCatalog,
        "cumulative_benchmark_pnl_percent",
        "(Rtn)",
        benchmarkMeta?.description || benchmarkMeta?.display_name || "",
        70,
        alignDataLeft
      );
      rtnCol.cellClass = "alpha-analysis-rtn-cell";

      if (hasPairedAlpha) {
        skipColumns.add(alphaColName);
        rtnCol.headerClass =
          "scalable-table-header alpha-analysis-child-header";

        const alphaChildren: ColDef<AlphaAnalysisRow>[] = [];
        if (simpleAlphaMeta) {
          const simpleCol = createMetricColumn(
            `${alphaColName}_SIMPLE`,
            metricsCatalog,
            "cumulative_simple_alpha_pnl_percent_nav",
            "Simple",
            simpleAlphaMeta.description || simpleAlphaMeta.display_name || "",
            70,
            alignDataLeft
          );
          simpleCol.cellClass = "alpha-analysis-alpha-first-cell";
          simpleCol.headerClass =
            "scalable-table-header alpha-analysis-child-header";
          alphaChildren.push(simpleCol);
        }
        if (netAdjAlphaMeta) {
          const netAdjCol = createMetricColumn(
            `${alphaColName}_NET ADJ`,
            metricsCatalog,
            "cumulative_net_adjusted_alpha_pnl_percent_nav",
            "Net Adj",
            netAdjAlphaMeta.description || netAdjAlphaMeta.display_name || "",
            90,
            alignDataLeft
          );
          netAdjCol.headerClass =
            "scalable-table-header alpha-analysis-child-header";
          alphaChildren.push(netAdjCol);
        }

        result.push({
          headerName: shortName,
          headerClass:
            "scalable-table-header ag-header-group-cell-label-center alpha-analysis-benchmark-group",
          children: [rtnCol],
          marryChildren: true,
        } as ColGroupDef<AlphaAnalysisRow>);

        if (alphaChildren.length > 0) {
          result.push({
            headerName: `Alpha (% NAV vs ${shortName})`,
            headerClass:
              "scalable-table-header ag-header-group-cell-label-center alpha-analysis-alpha-group",
            children: alphaChildren,
            marryChildren: true,
          } as ColGroupDef<AlphaAnalysisRow>);
        }
      } else {
        rtnCol.headerName = `${shortName} RTN`;
        rtnCol.headerClass = "scalable-table-header";
        result.push(rtnCol);
      }
      skipColumns.add(colName);
      continue;
    }

    const alphaMatch = colName.match(/^Alpha \(% NAV vs (.+)\)$/);
    if (alphaMatch) {
      const shortName = getBenchmarkShortName(alphaMatch[1]);
      const alphaChildren: ColDef<AlphaAnalysisRow>[] = [];

      if (simpleAlphaMeta) {
        alphaChildren.push(
          createMetricColumn(
            `${colName}_SIMPLE`,
            metricsCatalog,
            "cumulative_simple_alpha_pnl_percent_nav",
            "Simple",
            simpleAlphaMeta.description || simpleAlphaMeta.display_name || "",
            70,
            alignDataLeft
          )
        );
      }
      if (netAdjAlphaMeta) {
        alphaChildren.push(
          createMetricColumn(
            `${colName}_NET ADJ`,
            metricsCatalog,
            "cumulative_net_adjusted_alpha_pnl_percent_nav",
            "Net Adj",
            netAdjAlphaMeta.description || netAdjAlphaMeta.display_name || "",
            90,
            alignDataLeft
          )
        );
      }
      if (alphaChildren.length > 0) {
        result.push({
          headerName: `Alpha (% NAV vs ${shortName})`,
          headerClass:
            "scalable-table-header ag-header-group-cell-label-center alpha-analysis-alpha-group",
          children: alphaChildren,
          marryChildren: true,
        } as ColGroupDef<AlphaAnalysisRow>);
      }
      skipColumns.add(colName);
      continue;
    }

    const raw = metricsCatalog.find((m) => m.name === colName);
    const displayType = toMetricDisplayType(
      raw?.display_type,
      MetricDisplayType.percent
    );
    const metric = raw ? { display_type: displayType } : undefined;

    result.push({
      ...baseColumnProps,
      field: colName,
      colId: raw?.name ?? colName,
      headerName: raw?.display_name ?? colName,
      headerTooltip: raw?.description ?? raw?.display_name,
      valueFormatter: (params: ValueFormatterParams<AlphaAnalysisRow>) =>
        formatMetric(params.value, displayType),
      cellStyle: (params: ValueFormatterParams<AlphaAnalysisRow>) => {
        const status = getValueStatusForMetric({ value: params.value, metric });
        return {
          ...defaultStyle,
          justifyContent: alignDataLeft
            ? "flex-start"
            : defaultStyle.justifyContent,
          color: cellColor[status],
        };
      },
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      ...createFullPrecisionPercentTooltipProps(
        metric as { display_type?: MetricDisplayType }
      ),
    } as ColDef<AlphaAnalysisRow>);
    skipColumns.add(colName);
  }

  return result;
};

export const createGroupByColumn = (
  groupByFieldName?: string,
  groupByFieldDescription?: string,
  groupByValue?: string
): ColDef<AlphaAnalysisRow> => ({
  ...baseColumnProps,
  colId: "groupBy",
  field: groupByValue,
  headerName: groupByFieldName ?? "Group",
  headerTooltip: groupByFieldDescription ?? "",
  pinned: "left",
  maxWidth:
    groupByValue === "fund_name"
      ? 80
      : groupByValue === "market_cap"
        ? 120
        : undefined,
  width: groupByValue === "market_cap" ? 120 : undefined,
  cellStyle: {
    ...defaultStyle,
    justifyContent: "flex-start",
  },
});
