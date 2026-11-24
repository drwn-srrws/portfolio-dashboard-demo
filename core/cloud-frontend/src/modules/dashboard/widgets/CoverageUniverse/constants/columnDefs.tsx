import { MetricCatalogItem, MetricDisplayType } from "@api/types";
import { equals } from "ramda";
import {
  ColDef,
  ValueFormatterParams,
  ValueGetterParams,
  ITooltipParams,
} from "@ag-grid-community/core";
import { formatMetric } from "@utils/metrics";
import { CoverageCell, CoverageCellValue } from "../cells/CoverageCell";
import {
  DownsidePriceTargetCell,
  DownsidePriceTargetCellValue,
} from "../cells/DownsidePriceTargetCell";
import { NameCell } from "../cells/NameCell";
import {
  PrimaryAnalystCell,
  PrimaryAnalystCellValue,
} from "../cells/PrimaryAnalystCell";
import { RatingCell, RatingCellValue } from "../cells/RatingCell";
import {
  SecondaryAnalystCell,
  SecondaryAnalystCellValue,
} from "../cells/SecondaryAnalystCell";
import {
  VentureAnalystCell,
  VentureAnalystCellValue,
} from "../cells/VentureAnalystCell";
import {
  UpsidePriceTargetCell,
  UpsidePriceTargetCellValue,
} from "../cells/UpsidePriceTargetCell";
import { PriceCell, PriceCellValue } from "../cells/PriceCell";
import { RealTimeCell } from "../components/RealTimeCell";

import { CompanyRow, DrugProgramRow } from "../helpers/mapCompaniesToRows";
import { sparklineRendererParams } from "../helpers/sparklineRendererParams";
import {
  DevelopmentStageCell,
  DevelopmentStageCellValue,
} from "../cells/DevelopmentStageCell";
import {
  TherapeuticAreaCell,
  TherapeuticAreaCellValue,
} from "../cells/TherapeuticAreaCell";
import { Column } from "../types/Column";
import { RowLevel } from "../types/RowLevel";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import { createPortal } from "react-dom";
import { getMetricData } from "../helpers/getMetricData";
import { DTDTimeseries } from "../components/DTDTimeseries";
import { createMetricPercentPrecisionTooltip } from "@/utils/ag-grid/tooltips";

export const defaultColDef: ColDef<CompanyRow> = {
  flex: 1,
  resizable: true,
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
};

export const defaultDrugProgramColDef: ColDef<DrugProgramRow> = {
  flex: 1,
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
  resizable: true,
  headerClass: "scalable-table-header",
  sortable: true,
  minWidth: 100,
};

export const createColumnDefs = (
  catalogFields: MetricCatalogItem[] = [],
  isLoadingRealTimeData: boolean,
  isAdmin: boolean = false,
  selectedBenchmark: string | null = null
): ColDef<CompanyRow>[] => {
  return [
    {
      colId: Column.Name,
      field: "name",
      headerName: getMetricData(catalogFields, "name")?.display_name,
      headerTooltip: getMetricData(catalogFields, "name")?.description,
      minWidth: 300,
      sortable: true,
      pinned: true,
      headerClass: "scalable-table-header",
      tooltipValueGetter: (params: ITooltipParams) => {
        if (params.node && params.node.level > 0) {
          return params.value || "";
        }
        return "";
      },
      valueGetter: (params: ValueGetterParams<CompanyRow>) => ({
        id: params.data?.id,
        name: params.data?.name,
        workflowStatus: params.data?.workflow_status,
        in_portfolio: params.data?.in_portfolio,
        kgStatus: params.data?.kg_status,
      }),
      equals,
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: { innerRenderer: NameCell, suppressCount: true },
      comparator: () => 0,
    },
    {
      colId: Column.Ticker,
      headerClass: "scalable-table-header",
      headerName: "Ticker",
      headerTooltip: "Primary instrument ticker",
      minWidth: 100,
      sortable: true,
      pinned: true,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        if (!params.data || params.node?.level !== RowLevel.Company) return "";
        const ticker = params.data.primary_instrument?.ticker;
        // @ts-expect-error - temporary fix until schema is updated
        const bbgYellowKey = params.data.primary_instrument?.bbg_yellow_key;
        return ticker || bbgYellowKey || "";
      },
      comparator: () => 0,
    },
    {
      colId: Column.Currency,
      field: "primary_instrument.currency",
      headerClass: "scalable-table-header",
      headerName: "Currency",
      headerTooltip: "Primary instrument currency",
      minWidth: 80,
      sortable: true,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        if (!params.data || params.node?.level !== RowLevel.Company) return "";
        return params.data.primary_instrument?.currency || "";
      },
      comparator: () => 0,
    },
    {
      colId: Column.Coverage,
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "research_analysts.name")
        ?.display_name,
      headerTooltip: getMetricData(catalogFields, "research_analysts.name")
        ?.description,
      minWidth: 175,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        if (!params.data) return null;

        const value: CoverageCellValue = {
          companyId: params.data.id,
          researchAnalysts: params.data.research_analysts ?? [],
        };

        return value;
      },
      equals,
      cellRenderer: CoverageCell,
      comparator: () => 0,
    },
    {
      colId: Column.PrimaryAnalyst,
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "primary_analyst.name")
        ?.display_name,
      headerTooltip: getMetricData(catalogFields, "primary_analyst.name")
        ?.description,
      minWidth: 175,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        if (!params.data) return null;

        const value: PrimaryAnalystCellValue = {
          companyId: params.data.id,
          primaryAnalyst: params.data.primary_analyst ?? null,
          secondaryAnalysts: params.data.secondary_analysts ?? [],
        };

        return value;
      },
      equals,
      cellRenderer: PrimaryAnalystCell,
      comparator: () => 0,
    },
    {
      colId: Column.SecondaryAnalysts,
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "secondary_analysts.name")
        ?.display_name,
      headerTooltip: getMetricData(catalogFields, "secondary_analysts.name")
        ?.description,
      minWidth: 175,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        if (!params.data) return null;

        const value: SecondaryAnalystCellValue = {
          companyId: params.data.id,
          primaryAnalyst: params.data.primary_analyst ?? null,
          secondaryAnalysts: params.data.secondary_analysts ?? [],
        };

        return value;
      },
      equals,
      cellRenderer: SecondaryAnalystCell,
      comparator: () => 0,
    },
    {
      colId: Column.VentureAnalyst,
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "venture_analyst.name")
        ?.display_name,
      headerTooltip: getMetricData(catalogFields, "venture_analyst.name")
        ?.description,
      minWidth: 175,
      hide: !isAdmin,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        if (!params.data) return null;

        const value: VentureAnalystCellValue = {
          companyId: params.data.id,
          ventureAnalyst: params.data.venture_analyst ?? null,
        };

        return value;
      },
      equals,
      cellRenderer: VentureAnalystCell,
      comparator: () => 0,
    },
    {
      colId: Column.UpsidePriceTarget,
      headerClass: "scalable-table-header",
      headerName: "Upside PT",
      headerTooltip: "Upside Price Target",
      minWidth: 100,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        if (!params.data) return null;

        const value: UpsidePriceTargetCellValue = {
          companyId: params.data.id,
          primaryAnalystId: params.data.primary_analyst?.id ?? null,
          priceTarget: params.data.primary_analyst_upside_price_target ?? null,
        };

        return value;
      },
      equals,
      cellRenderer: UpsidePriceTargetCell,
      comparator: () => 0,
    },
    {
      colId: Column.DownsidePriceTarget,
      headerClass: "scalable-table-header",
      headerName: "Downside PT",
      headerTooltip: "Downside Price Target",
      minWidth: 100,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        if (!params.data) return null;

        const value: DownsidePriceTargetCellValue = {
          companyId: params.data.id,
          primaryAnalystId: params.data.primary_analyst?.id ?? null,
          priceTarget:
            params.data.primary_analyst_downside_price_target ?? null,
        };

        return value;
      },
      equals,
      cellRenderer: DownsidePriceTargetCell,
      comparator: () => 0,
    },
    {
      colId: Column.Rating,
      headerClass: "scalable-table-header",
      headerName: "Rating",
      headerTooltip: "Analyst Rating",
      minWidth: 100,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        if (!params.data) return null;

        const value: RatingCellValue = {
          companyId: params.data.id,
          primaryAnalystId: params.data.primary_analyst?.id ?? null,
          rating: params.data.primary_analyst_rating ?? null,
        };

        return value;
      },
      equals,
      cellRenderer: RatingCell,
      comparator: () => 0,
    },
    {
      colId: Column.Price,
      headerClass: "scalable-table-header",
      headerName: "Realtime Price",
      headerTooltip: "Real-time price",
      minWidth: 100,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        if (params.node?.level !== RowLevel.Company) return null;

        const value: PriceCellValue = {
          realtimePriceHistory: params.data?.realtimePriceHistory ?? [],
          lastPriceBbg: params.data?.last_price_bbg ?? null,
        };

        return value;
      },
      equals,
      cellRenderer: PriceCell,
      comparator: () => 0,
    },
    {
      colId: Column.DtdDollarReturn,
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "dtd_dollar_return_bbg")
        ?.display_name,
      minWidth: 100,
      headerTooltip: getMetricData(catalogFields, "dtd_dollar_return_bbg")
        ?.description,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        return {
          dtd_dollar_return_bbg: params.data?.dtd_dollar_return_bbg,
          realtimePriceHistory: params.data?.realtimePriceHistory,
        };
      },
      cellRenderer: (params: ValueGetterParams<CompanyRow>) => (
        <RealTimeCell
          params={params}
          catalogFields={catalogFields}
          realtimeField="dtd_daily_return"
          bloombergField="dtd_dollar_return_bbg"
          metricKey="dtd_dollar_return_bbg"
        />
      ),
      comparator: () => 0,
    },
    {
      colId: Column.DtdPercentReturn,
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "dtd_percent_return_bbg")
        ?.display_name,
      minWidth: 100,
      headerTooltip: getMetricData(catalogFields, "dtd_percent_return_bbg")
        ?.description,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        return {
          dtd_percent_return_bbg: params.data?.dtd_percent_return_bbg,
          realtimePriceHistory: params.data?.realtimePriceHistory,
        };
      },
      cellRenderer: (params: ValueGetterParams<CompanyRow>) => (
        <RealTimeCell
          params={params}
          catalogFields={catalogFields}
          realtimeField="dtd_percent_return"
          bloombergField="dtd_percent_return_bbg"
          metricKey="dtd_percent_return_bbg"
        />
      ),
      ...createMetricPercentPrecisionTooltip(
        catalogFields,
        "dtd_percent_return_bbg"
      ),
      comparator: () => 0,
    },
    {
      colId: Column.RealTimePrice,
      headerClass: "scalable-table-header",
      headerName: "DTD Curve",
      minWidth: 135,
      headerTooltip: "Real-time price chart with intraday data",
      cellRenderer: (params: ValueGetterParams<CompanyRow>) => (
        <DTDTimeseries
          data={params.data?.dtd_price_curve || []}
          params={params}
          isLoading={isLoadingRealTimeData}
        />
      ),
    },
    {
      colId: Column.PriceMovement,
      headerClass: "scalable-table-header",
      headerName: "YTD Price Curve",
      minWidth: 100,
      headerTooltip: getMetricData(catalogFields, "ytd_dollar_return_bbg")
        ?.description,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        return (
          params.data?.market_price_history_ytd_bbg?.map((item) => [
            item.date,
            item.market_price,
          ]) || []
        );
      },
      equals,
      cellRenderer: "agSparklineCellRenderer",
      cellRendererParams: sparklineRendererParams(catalogFields),
      comparator: () => 0,
    },
    {
      colId: Column.MarketCap,
      field: "market_cap_bbg",
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "market_cap_bbg")?.display_name,
      headerTooltip: getMetricData(catalogFields, "market_cap_bbg")
        ?.description,
      minWidth: 100,
      valueFormatter: (params: ValueFormatterParams<CompanyRow>) => {
        if (params.node?.level !== RowLevel.Company) return "";
        const formatted = formatMetric(
          params.value,
          getMetricData(catalogFields, "market_cap_bbg")
            ?.display_type as MetricDisplayType
        );
        // Mark Pitchbook last-known-valuation fallback values with an asterisk
        // (the header tooltip explains the meaning). Leave empty/dash as-is.
        return params.data?.market_cap_bbg_is_estimated &&
          formatted &&
          formatted !== "-"
          ? `${formatted}*`
          : formatted;
      },
      comparator: () => 0,
    },
    {
      colId: Column.EnterpriseValue,
      field: "enterprise_value_bbg",
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "enterprise_value_bbg")
        ?.display_name,
      headerTooltip: getMetricData(catalogFields, "enterprise_value_bbg")
        ?.description,
      minWidth: 150,
      valueFormatter: (params: ValueFormatterParams<CompanyRow>) => {
        return formatMetric(
          params.data?.enterprise_value_bbg,
          getMetricData(catalogFields, "enterprise_value_bbg")
            ?.display_type as MetricDisplayType
        );
      },

      comparator: () => 0,
    },
    {
      colId: Column.Volume,
      field: "volume_bbg",
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "volume_bbg")?.display_name,
      minWidth: 100,
      headerTooltip: getMetricData(catalogFields, "volume_bbg")?.description,

      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        return params.data?.volume_bbg;
      },
      valueFormatter: (params: ValueFormatterParams<CompanyRow>) =>
        params.node?.level === RowLevel.Company
          ? formatMetric(
              params.value,
              getMetricData(catalogFields, "volume_bbg")
                ?.display_type as MetricDisplayType
            )
          : "",
      comparator: () => 0,
    },
    {
      colId: Column.GrossTotalReturn,
      field: "gross_total_return_bbg",
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "gross_total_return_bbg")
        ?.display_name,
      minWidth: 100,
      headerTooltip: getMetricData(catalogFields, "gross_total_return_bbg")
        ?.description,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        return formatMetric(
          params.data?.gross_total_return_bbg,
          getMetricData(catalogFields, "gross_total_return_bbg")
            ?.display_type as MetricDisplayType
        );
      },
      ...createMetricPercentPrecisionTooltip(
        catalogFields,
        "gross_total_return_bbg"
      ),
      comparator: () => 0,
    },
    {
      colId: Column.DayHigh,
      field: "day_high_bbg",
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "day_high_bbg")?.display_name,
      minWidth: 100,
      headerTooltip: getMetricData(catalogFields, "day_high_bbg")?.description,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        return formatMetric(
          params.data?.day_high_bbg,
          getMetricData(catalogFields, "day_high_bbg")
            ?.display_type as MetricDisplayType
        );
      },
      comparator: () => 0,
    },
    {
      colId: Column.DayLow,
      field: "day_low_bbg",
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "day_low_bbg")?.display_name,
      minWidth: 100,
      headerTooltip: getMetricData(catalogFields, "day_low_bbg")?.description,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        return formatMetric(
          params.data?.day_low_bbg,
          getMetricData(catalogFields, "day_low_bbg")
            ?.display_type as MetricDisplayType
        );
      },
      comparator: () => 0,
    },
    {
      colId: Column.ShortInterestRatio,
      field: "short_interest_ratio_bbg",
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "short_interest_ratio_bbg")
        ?.display_name,
      minWidth: 130,
      headerTooltip: getMetricData(catalogFields, "short_interest_ratio_bbg")
        ?.description,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        return formatMetric(
          params.data?.short_interest_ratio_bbg,
          getMetricData(catalogFields, "short_interest_ratio_bbg")
            ?.display_type as MetricDisplayType
        );
      },
      comparator: () => 0,
    },
    {
      colId: Column.ShortInterestPctEquity,
      field: "short_interest_pct_equity_bbg",
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "short_interest_pct_equity_bbg")
        ?.display_name,
      minWidth: 130,
      headerTooltip: getMetricData(
        catalogFields,
        "short_interest_pct_equity_bbg"
      )?.description,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        return formatMetric(
          params.data?.short_interest_pct_equity_bbg,
          getMetricData(catalogFields, "short_interest_pct_equity_bbg")
            ?.display_type as MetricDisplayType
        );
      },
      ...createMetricPercentPrecisionTooltip(
        catalogFields,
        "short_interest_pct_equity_bbg"
      ),
      comparator: () => 0,
    },
    {
      colId: Column.SharesOutstanding,
      field: "shares_outstanding_bbg",
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "shares_outstanding_bbg")
        ?.display_name,
      minWidth: 130,
      headerTooltip: getMetricData(catalogFields, "shares_outstanding_bbg")
        ?.description,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        return formatMetric(
          params.data?.shares_outstanding_bbg,
          getMetricData(catalogFields, "shares_outstanding_bbg")
            ?.display_type as MetricDisplayType
        );
      },
      comparator: () => 0,
    },
    {
      colId: Column.AvgVolume3m,
      field: "avg_volume_3m_bbg",
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "avg_volume_3m_bbg")
        ?.display_name,
      minWidth: 120,
      headerTooltip: getMetricData(catalogFields, "avg_volume_3m_bbg")
        ?.description,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        return formatMetric(
          params.data?.avg_volume_3m_bbg,
          getMetricData(catalogFields, "avg_volume_3m_bbg")
            ?.display_type as MetricDisplayType
        );
      },
      comparator: () => 0,
    },
    {
      colId: Column.High52w,
      field: "high_52w_bbg",
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "high_52w_bbg")?.display_name,
      minWidth: 100,
      headerTooltip: getMetricData(catalogFields, "high_52w_bbg")?.description,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        return params.node?.level === RowLevel.Company
          ? formatMetric(
              params.data?.high_52w_bbg,
              getMetricData(catalogFields, "high_52w_bbg")
                ?.display_type as MetricDisplayType
            )
          : "";
      },
      comparator: () => 0,
    },
    {
      colId: Column.Low52w,
      field: "low_52w_bbg",
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "low_52w_bbg")?.display_name,
      minWidth: 100,
      headerTooltip: getMetricData(catalogFields, "low_52w_bbg")?.description,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        return params.node?.level === RowLevel.Company
          ? formatMetric(
              params.data?.low_52w_bbg,
              getMetricData(catalogFields, "low_52w_bbg")
                ?.display_type as MetricDisplayType
            )
          : "";
      },
      comparator: () => 0,
    },
    {
      colId: Column.MtdDollarReturn,
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "mtd_dollar_return_bbg")
        ?.display_name,
      minWidth: 100,
      headerTooltip: getMetricData(catalogFields, "mtd_dollar_return_bbg")
        ?.description,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        return {
          mtd_dollar_return_bbg: params.data?.mtd_dollar_return_bbg,
          realtimePriceHistory: params.data?.realtimePriceHistory,
        };
      },
      cellRenderer: (params: ValueGetterParams<CompanyRow>) => (
        <RealTimeCell
          params={params}
          catalogFields={catalogFields}
          realtimeField="mtd_daily_return"
          bloombergField="mtd_dollar_return_bbg"
          metricKey="mtd_dollar_return_bbg"
        />
      ),
      comparator: () => 0,
    },
    {
      colId: Column.MtdPercentReturn,
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "mtd_percent_return_bbg")
        ?.display_name,
      minWidth: 100,
      headerTooltip: getMetricData(catalogFields, "mtd_dollar_return_bbg")
        ?.description,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        return {
          mtd_percent_return_bbg: params.data?.mtd_percent_return_bbg,
          realtimePriceHistory: params.data?.realtimePriceHistory,
        };
      },
      cellRenderer: (params: ValueGetterParams<CompanyRow>) => (
        <RealTimeCell
          params={params}
          catalogFields={catalogFields}
          realtimeField="mtd_percent_return"
          bloombergField="mtd_percent_return_bbg"
          metricKey="mtd_percent_return_bbg"
        />
      ),
      ...createMetricPercentPrecisionTooltip(
        catalogFields,
        "mtd_percent_return_bbg"
      ),
      comparator: () => 0,
    },
    {
      colId: Column.QtdDollarReturn,
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "qtd_dollar_return_bbg")
        ?.display_name,
      minWidth: 100,
      headerTooltip: getMetricData(catalogFields, "qtd_dollar_return_bbg")
        ?.description,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        return {
          qtd_dollar_return_bbg: params.data?.qtd_dollar_return_bbg,
          realtimePriceHistory: params.data?.realtimePriceHistory,
        };
      },
      cellRenderer: (params: ValueGetterParams<CompanyRow>) => (
        <RealTimeCell
          params={params}
          catalogFields={catalogFields}
          realtimeField="qtd_daily_return"
          bloombergField="qtd_dollar_return_bbg"
          metricKey="qtd_dollar_return_bbg"
        />
      ),
      comparator: () => 0,
    },
    {
      colId: Column.QtdPercentReturn,
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "qtd_percent_return_bbg")
        ?.display_name,
      minWidth: 100,
      headerTooltip: getMetricData(catalogFields, "qtd_percent_return_bbg")
        ?.description,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        return {
          qtd_percent_return_bbg: params.data?.qtd_percent_return_bbg,
          realtimePriceHistory: params.data?.realtimePriceHistory,
        };
      },
      cellRenderer: (params: ValueGetterParams<CompanyRow>) => (
        <RealTimeCell
          params={params}
          catalogFields={catalogFields}
          realtimeField="qtd_percent_return"
          bloombergField="qtd_percent_return_bbg"
          metricKey="qtd_percent_return_bbg"
        />
      ),
      ...createMetricPercentPrecisionTooltip(
        catalogFields,
        "qtd_percent_return_bbg"
      ),
      comparator: () => 0,
    },
    {
      colId: Column.YtdDollarReturn,
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "ytd_dollar_return_bbg")
        ?.display_name,
      minWidth: 100,
      headerTooltip: getMetricData(catalogFields, "ytd_dollar_return_bbg")
        ?.description,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        return {
          ytd_dollar_return_bbg: params.data?.ytd_dollar_return_bbg,
          realtimePriceHistory: params.data?.realtimePriceHistory,
        };
      },
      cellRenderer: (params: ValueGetterParams<CompanyRow>) => (
        <RealTimeCell
          params={params}
          catalogFields={catalogFields}
          realtimeField="ytd_daily_return"
          bloombergField="ytd_dollar_return_bbg"
          metricKey="ytd_dollar_return_bbg"
        />
      ),
      comparator: () => 0,
    },
    {
      colId: Column.YtdPercentReturn,
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "ytd_percent_return_bbg")
        ?.display_name,
      minWidth: 100,
      headerTooltip: getMetricData(catalogFields, "ytd_percent_return_bbg")
        ?.description,
      valueGetter: (params: ValueGetterParams<CompanyRow>) => {
        return {
          ytd_percent_return_bbg: params.data?.ytd_percent_return_bbg,
          realtimePriceHistory: params.data?.realtimePriceHistory,
        };
      },
      cellRenderer: (params: ValueGetterParams<CompanyRow>) => (
        <RealTimeCell
          params={params}
          catalogFields={catalogFields}
          realtimeField="ytd_percent_return"
          bloombergField="ytd_percent_return_bbg"
          metricKey="ytd_percent_return_bbg"
        />
      ),
      ...createMetricPercentPrecisionTooltip(
        catalogFields,
        "ytd_percent_return_bbg"
      ),
      comparator: () => 0,
    },
    {
      colId: Column.IvolRatio,
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "ivol_ratio")?.display_name,
      headerTooltip: getMetricData(catalogFields, "ivol_ratio")?.description,
      minWidth: 100,
      valueGetter: (params: ValueGetterParams<CompanyRow>) =>
        (selectedBenchmark && params.data?.ivol_ratio?.[selectedBenchmark]) ??
        null,
      valueFormatter: (params: ValueFormatterParams<CompanyRow>) =>
        formatMetric(
          params.value?.value,
          getMetricData(catalogFields, "ivol_ratio")
            ?.display_type as MetricDisplayType
        ),
      tooltipValueGetter: (params: ITooltipParams) =>
        params.value?.benchmark_index && params.value?.date
          ? [
              `benchmark: ${params.value.benchmark_index}`,
              `benchmark iVol date: ${params.value.date}`,
            ].join("\n")
          : "",
      comparator: () => 0,
    },
    {
      colId: Column.TotalRaised,
      field: "pitchbook_profile.total_raised",
      headerClass: "scalable-table-header",
      headerName: getMetricData(catalogFields, "pitchbook_profile.total_raised")
        ?.display_name,
      headerTooltip: getMetricData(
        catalogFields,
        "pitchbook_profile.total_raised"
      )?.description,
      minWidth: 120,
      valueFormatter: (params: ValueFormatterParams<CompanyRow>) =>
        params.node?.level === RowLevel.Company
          ? formatMetric(
              params.value,
              getMetricData(catalogFields, "pitchbook_profile.total_raised")
                ?.display_type as MetricDisplayType
            )
          : "",
      comparator: () => 0,
    },
    {
      colId: Column.LastRound,
      field: "pitchbook_profile.last_round_date",
      headerClass: "scalable-table-header",
      headerName: getMetricData(
        catalogFields,
        "pitchbook_profile.last_round_date"
      )?.display_name,
      headerTooltip: getMetricData(
        catalogFields,
        "pitchbook_profile.last_round_date"
      )?.description,
      minWidth: 120,
      valueFormatter: (params: ValueFormatterParams<CompanyRow>) =>
        params.node?.level === RowLevel.Company
          ? formatMetric(
              params.value,
              getMetricData(catalogFields, "pitchbook_profile.last_round_date")
                ?.display_type as MetricDisplayType
            )
          : "",
      comparator: () => 0,
    },
  ];
};

export const createTherapeuticAreaColumnDef = (): ColDef<CompanyRow> => ({
  colId: Column.TherapeuticArea,
  headerClass: "scalable-table-header",
  headerName: "Therapeutic Area",
  headerTooltip:
    "Top therapeutic areas weighted by KG drug-indication coverage",
  minWidth: 150,
  flex: 1,
  valueGetter: (
    params: ValueGetterParams<CompanyRow>
  ): TherapeuticAreaCellValue | null => {
    if (params.node?.level !== RowLevel.Company) return null;

    const ta = params.data?.weighted_attributes?.therapeutic_areas ?? [];
    const items = ta.map((item) => ({
      label: item.value,
      value: item.weight,
    }));

    return {
      companyId: params.data?.id ?? null,
      items,
      kgStatus: params.data?.kg_status,
    };
  },
  equals,
  cellRenderer: TherapeuticAreaCell,
  comparator: () => 0,
  sortable: false,
});

export const createDevelopmentStageColumnDef = (): ColDef<CompanyRow> => ({
  colId: Column.DevelopmentStage,
  headerClass: "scalable-table-header",
  headerName: "Development Stage",
  headerTooltip:
    "Top development stages weighted by KG drug-indication coverage",
  minWidth: 150,
  flex: 1,
  valueGetter: (
    params: ValueGetterParams<CompanyRow>
  ): DevelopmentStageCellValue | null => {
    if (params.node?.level !== RowLevel.Company) return null;

    const stages = params.data?.weighted_attributes?.development_stages ?? [];
    const items = stages.map((item) => ({
      label: item.value,
      value: item.weight,
    }));

    return {
      companyId: params.data?.id ?? null,
      items,
      kgStatus: params.data?.kg_status,
    };
  },
  equals,
  cellRenderer: DevelopmentStageCell,
  comparator: () => 0,
  sortable: false,
});

const formatDrugProgramWeight = (weight: number | null | undefined): string => {
  if (weight == null) {
    return "";
  }
  if (weight > 0 && weight < 0.01) {
    return "< 0.01%";
  }
  return `${weight.toFixed(2)}%`;
};

const truncatedTooltipCellRenderer = (
  params: ValueFormatterParams<DrugProgramRow>
) => {
  return (
    <Tooltip>
      <TooltipTrigger className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-left">
        {params.value}
      </TooltipTrigger>

      {params.value &&
        createPortal(
          <TooltipContent
            className="z-[2000] ml-1 bg-neutral-800 text-white border border-neutral-600 shadow-md max-w-[20rem] break-words"
            side="right"
          >
            {params.value}
          </TooltipContent>,
          document.body
        )}
    </Tooltip>
  );
};

export const createDrugProgramColumnDefs = (): ColDef<DrugProgramRow>[] => [
  {
    colId: "name",
    headerName: "Drug Name",
    field: "name",
    minWidth: 180,
  },
  {
    colId: "molecule_type",
    headerName: "Modality",
    field: "molecule_type",
    minWidth: 150,
  },
  {
    colId: "therapeutic_areas",
    headerName: "Therapeutic Area",
    field: "therapeutic_areas",
    minWidth: 180,
    cellRenderer: truncatedTooltipCellRenderer,
  },
  {
    colId: "weight",
    headerName: "Weight",
    field: "weight",
    minWidth: 100,
    sortable: true,
    valueFormatter: (params) => formatDrugProgramWeight(params.value),
  },
  {
    colId: "indications",
    headerName: "Indication",
    field: "indications",
    minWidth: 200,
    cellRenderer: truncatedTooltipCellRenderer,
  },
  {
    colId: "development_stage",
    headerName: "Development Stage",
    field: "development_stage",
    minWidth: 160,
  },
  {
    colId: "mechanism_of_action",
    headerName: "MoA",
    field: "mechanism_of_action",
    minWidth: 200,
    cellRenderer: truncatedTooltipCellRenderer,
  },
  {
    colId: "drug_type",
    headerName: "Drug Classification",
    field: "drug_type",
    minWidth: 170,
  },
];

export const drugProgramColumnDefs: ColDef<DrugProgramRow>[] =
  createDrugProgramColumnDefs();
