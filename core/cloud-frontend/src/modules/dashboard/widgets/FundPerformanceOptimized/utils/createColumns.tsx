import { MetricCatalogItem as MetricCatalogItem } from "@api/types/index";
import { cellColor } from "@/utils/ag-grid/cells";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import { ColDef, ValueFormatterParams } from "@ag-grid-community/core";
import { FundPerformanceRow } from "./transformData";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

const NAME_COLUMN = "name";

const nameColumn: ColDef<FundPerformanceRow> = {
  field: NAME_COLUMN,
  headerName: "Name",
  flex: 2,
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
};

// TODO: Remove this mapping once the backend returns catalog metric names
// in display_columns and data fields (e.g. daily_pnl_percent_nav instead of dtd_pnl).
// See: other endpoints (liquidity-summary, basket-breakdown) already do this correctly.
const CATALOG_KEY_OVERRIDES: Record<string, string> = {
  dtd_pnl: "daily_pnl_percent_nav",
  mtd_pnl: "mtd_pnl_percent_nav",
  qtd_pnl: "qtd_pnl_percent_nav",
  ytd_pnl: "ytd_pnl_percent_nav",
};

const findCatalogEntry = (
  catalog: MetricCatalogItem[],
  fieldName: string
): MetricCatalogItem | undefined => {
  const catalogKey = CATALOG_KEY_OVERRIDES[fieldName] ?? fieldName;
  return catalog.find((m) => m.name === catalogKey);
};

const deriveHeaderName = (fieldName: string): string =>
  fieldName.replace(/_pnl$/, "").toUpperCase();

export const createFundPerformanceColumns = (
  metricsCatalog: MetricCatalogItem[],
  displayColumns: string[]
): ColDef<FundPerformanceRow>[] => {
  const metricColumns = displayColumns
    .filter((col) => col !== NAME_COLUMN)
    .map((fieldName): ColDef<FundPerformanceRow> => {
      const metric = findCatalogEntry(metricsCatalog, fieldName);

      return {
        field: fieldName,
        colId: fieldName,
        headerName: metric?.display_name ?? deriveHeaderName(fieldName),
        headerTooltip: metric?.description ?? metric?.display_name ?? undefined,
        valueFormatter: (params: ValueFormatterParams<FundPerformanceRow>) =>
          metric?.display_type
            ? formatMetric(params.value, metric.display_type)
            : "",
        cellStyle: (params: ValueFormatterParams<FundPerformanceRow>) => {
          const status = getValueStatusForMetric({
            value: params.value,
            metric,
          });
          return { ...defaultStyle, color: cellColor[status] };
        },
        ...createFullPrecisionPercentTooltipProps(metric),
        comparator: (valueA: number, valueB: number) => valueA - valueB,
        suppressHeaderMenuButton: true,
        suppressHeaderFilterButton: true,
      };
    });

  return [nameColumn, ...metricColumns];
};
