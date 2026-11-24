import {
  ColDef,
  SizeColumnsToFitGridStrategy,
  ValueFormatterParams,
} from "@ag-grid-community/core";
import { MetricCatalogItem } from "@api/types/index";
import { cellColor } from "@/utils/ag-grid/cells";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";
import { AnalystAvatarRenderer } from "@/modules/dashboard/widgets/PortfolioSummary/components/AnalystAvatarRenderer";
import { PortfolioSummaryRow } from "./buildNestedRows";

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

export const portfolioSummaryDefaultColumn = {
  flex: 1,
  minWidth: 100,
  cellStyle: defaultStyle,
  resizable: true,
  headerClass: "dockview-table-header",
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
};

const AVATAR_COLUMNS: Record<string, { headerName: string }> = {
  primary_analyst_avatar: { headerName: "1° Analyst" },
  primary_analyst_avatars: { headerName: "1° Analyst" },
  secondary_analyst_avatars: { headerName: "2° Analyst" },
};

const createAvatarColumn = (
  columnName: string,
  metric: MetricCatalogItem | undefined
): ColDef<PortfolioSummaryRow> => {
  const config = AVATAR_COLUMNS[columnName];
  return {
    colId: columnName,
    headerName: config?.headerName ?? columnName,
    headerTooltip: metric?.description || config?.headerName || columnName,
    field: columnName,
    suppressHeaderMenuButton: true,
    resizable: true,
    maxWidth: 85,
    cellRenderer: (params: ValueFormatterParams<PortfolioSummaryRow>) => {
      const value = params.data?.[columnName];
      if (!value) return "";
      return <AnalystAvatarRenderer analystString={String(value)} />;
    },
  };
};

export const createPortfolioSummaryColumns = (
  metricsCatalog: MetricCatalogItem[],
  metricNames: string[]
): ColDef<PortfolioSummaryRow>[] => {
  return metricNames
    .map((columnName) => {
      const metric = metricsCatalog.find((m) => m.name === columnName);

      if (columnName in AVATAR_COLUMNS) {
        return createAvatarColumn(columnName, metric);
      }

      if (!metric) return null;

      return {
        colId: metric.name,
        headerName: metric.display_name,
        headerTooltip: metric.description || metric.display_name,
        field: metric.name,
        resizable: true,
        suppressHeaderMenuButton: true,
        suppressHeaderFilterButton: true,
        valueFormatter: (params: ValueFormatterParams<PortfolioSummaryRow>) => {
          if (!metric.display_type) return "";
          const displayType =
            metric.name === "average_cost"
              ? "dollars_regular"
              : metric.display_type;
          return formatMetric(params.value, displayType);
        },
        cellStyle: (params: ValueFormatterParams<PortfolioSummaryRow>) => {
          const status = getValueStatusForMetric({
            value: params.value,
            metric,
          });
          return { ...defaultStyle, color: cellColor[status] };
        },
        comparator: (valueA: number, valueB: number) => valueA - valueB,
        ...createFullPrecisionPercentTooltipProps(metric),
      } as ColDef<PortfolioSummaryRow>;
    })
    .filter(Boolean) as ColDef<PortfolioSummaryRow>[];
};

export const autoSizeStrategy: SizeColumnsToFitGridStrategy = {
  type: "fitGridWidth",
};

export const defaultDataGridProps = {
  defaultColDef: portfolioSummaryDefaultColumn,
  sideBar: false,
  suppressAggFuncInHeader: true,
  animateRows: false,
  rowSelection: "multiple" as const,
  treeData: true,
};
