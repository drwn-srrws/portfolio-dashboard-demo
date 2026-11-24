import {
  ColDef,
  ICellRendererParams,
  SizeColumnsToFitGridStrategy,
  ValueFormatterParams,
} from "@ag-grid-community/core";
import { PortfolioMetricCatalogItem as MetricCatalogItem } from "@api/types/index";
import { Avatar } from "@/components/Avatar";
import { cellColor } from "@/utils/ag-grid/cells";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import { MetricDisplayType } from "@api/types/index";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";
import { AnalystBreakdownRow } from "./buildRows";

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

const FALLBACK_DISPLAY_TYPES: Record<string, MetricDisplayType> = {
  primary_analyst_net_exposure: MetricDisplayType.dollars,
  primary_analyst_cumulative_pnl_percent_nav: MetricDisplayType.percent,
  secondary_analyst_net_exposure: MetricDisplayType.dollars,
  secondary_analyst_cumulative_pnl_percent_nav: MetricDisplayType.percent,
};

const AVATAR_COLUMN = "analyst_avatar";
const ANALYST_COLUMN = "analyst";

export const analystBreakdownOptimizedDefaultColumn = {
  flex: 1,
  minWidth: 70,
  cellStyle: defaultStyle,
  resizable: false,
  headerClass: "dockview-table-header",
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
};

const avatarColumn: ColDef<AnalystBreakdownRow> = {
  colId: AVATAR_COLUMN,
  headerName: "Analyst",
  field: AVATAR_COLUMN,
  maxWidth: 66,
  minWidth: 50,
  resizable: false,
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
  cellRenderer: (params: ICellRendererParams<AnalystBreakdownRow>) => {
    const avatarData = params.data?.analyst_avatar;
    if (!avatarData || avatarData === "N/C") {
      return (
        <div style={{ ...defaultStyle, justifyContent: "center" }}>
          <span className="text-xs text-muted-foreground">N/C</span>
        </div>
      );
    }

    const analystName = String(params.data?.analyst ?? "").trim();
    const [nameFirst = "", nameLast = ""] = analystName.split(/\s+/, 2);

    let email = "";
    let first_name = "";
    let last_name = "";

    if (avatarData.includes("|")) {
      [email = "", first_name = "", last_name = ""] = avatarData.split("|");
    } else if (avatarData.includes("@")) {
      email = avatarData;
      first_name = nameFirst;
      last_name = nameLast;
    } else {
      first_name = nameFirst || avatarData;
      last_name = nameLast;
    }

    return (
      <div style={{ ...defaultStyle, justifyContent: "center" }}>
        <Avatar data={{ email, first_name, last_name }} />
      </div>
    );
  },
};

const toMetricDisplayType = (
  raw: MetricCatalogItem["display_type"] | undefined,
  fallback: MetricDisplayType
): MetricDisplayType =>
  Object.values(MetricDisplayType).includes(raw as MetricDisplayType)
    ? (raw as MetricDisplayType)
    : fallback;

export const createAnalystBreakdownOptimizedColumns = (
  metricsCatalog: MetricCatalogItem[],
  displayColumns: string[]
): ColDef[] => {
  const metricKeys = displayColumns.filter(
    (col) => col !== AVATAR_COLUMN && col !== ANALYST_COLUMN
  );

  const metricColumns: ColDef[] = metricKeys.map((key) => {
    const raw = metricsCatalog.find((m) => m.name === key);
    const displayType = toMetricDisplayType(
      raw?.display_type,
      FALLBACK_DISPLAY_TYPES[key] ?? MetricDisplayType.float
    );
    const metric = raw ? { display_type: displayType } : undefined;

    return {
      colId: key,
      headerName: raw?.display_name ?? key,
      headerTooltip: raw?.description ?? raw?.display_name ?? undefined,
      field: key,
      valueFormatter: (params: ValueFormatterParams) =>
        formatMetric(params.value, displayType),
      cellStyle: (params: ValueFormatterParams) => {
        const status = getValueStatusForMetric({ value: params.value, metric });
        return {
          ...defaultStyle,
          color: cellColor[status],
        };
      },
      comparator: (valueA: number, valueB: number) => valueA - valueB,
      ...createFullPrecisionPercentTooltipProps(metric),
    };
  });

  return [avatarColumn, ...metricColumns];
};

export const autoSizeStrategy: SizeColumnsToFitGridStrategy = {
  type: "fitGridWidth",
};

export const defaultDataGridProps = {
  flex: 1,
  minWidth: 150,
  defaultColDef: analystBreakdownOptimizedDefaultColumn,
  sideBar: false,
  suppressAggFuncInHeader: true,
  animateRows: false,
};
