/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  SizeColumnsToFitGridStrategy,
  ValueFormatterParams,
} from "@ag-grid-community/core";

import {
  MetricDisplayType,
  MetricResultData,
  MetricCatalogItem as MetricCatalogItem,
} from "@api/types/index";
import { formatMetric } from "@/utils/metrics";
import { ColDef } from "@ag-grid-community/core";

import { MetricResultDataItem } from "./PositionDifferencesTable.utils";
import { getMetricData } from "../CoverageUniverse/helpers/getMetricData";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

export const positionDifferencesDefaultColumn = {
  flex: 1,
  minWidth: 150,
  cellStyle: defaultStyle,
  resizable: false,
  headerClass: "dockview-table-header",
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
};

export const getPositionDifferencesColumnMap = (
  metricsCatalog: Array<MetricCatalogItem>
) => {
  return {
    company_security_code_portfolio_asset_class: {
      colId: "company_security_code_portfolio_asset_class",
      headerName: "Investment Group",
      resizable: false,
      field: "company_security_code_portfolio_asset_class",
      headerTooltip: getMetricData(
        metricsCatalog,
        "company_security_code_portfolio_asset_class"
      )?.description,
      valueFormatter: (params) =>
        formatMetric(
          params.data?.company_security_code_portfolio_asset_class,
          MetricDisplayType.string
        ),
      filter: "agTextColumnFilter",
    } as ColDef<MetricResultDataItem>,
    difference: {
      colId: "difference",
      headerName: "Difference",
      field: "difference",
      resizable: false,
      pinned: "right",
      lockPinned: true,
      valueGetter: (params) => {
        if (!params.data) return null;

        const fundValues = Object.entries(params.data)
          .filter(
            ([key]) =>
              key !== "company_security_code_portfolio_asset_class" && key !== "id"
          )
          .map(([_, value]) => (value as number) || 0);

        const sortedValues = [...fundValues].sort((a, b) => a - b);
        const maxDifference = Math.abs(
          sortedValues[sortedValues.length - 1] - sortedValues[0]
        );

        return maxDifference;
      },
      valueFormatter: (params: ValueFormatterParams<MetricResultDataItem>) => {
        if (!params.value) return null;

        return formatMetric(params.value, MetricDisplayType.percent);
      },
      cellClass: "right-pinned",
      comparator: (valueA, valueB) => {
        if (valueA === null || valueA === undefined) return 1;
        if (valueB === null || valueB === undefined) return -1;

        return valueA - valueB;
      },
      sort: "desc",
      ...createFullPrecisionPercentTooltipProps({
        display_type: MetricDisplayType.percent,
      }),
    } as ColDef<MetricResultDataItem>,
  };
};

export const createPositionDifferencesColumns = (
  metricsCatalog: Array<MetricCatalogItem>,
  data?: MetricResultData
): ColDef<MetricResultDataItem>[] => {
  if (!data) return [];

  const fundNames = Array.from(new Set(data.map((item) => item.fund_name)));

  const dynamicColumns = fundNames.map((fund) => {
    return {
      headerName: fund,
      headerTooltip: fund,
      field: fund,
      filter: "",
      width: 90,

      valueFormatter: (params: ValueFormatterParams<MetricResultDataItem>) => {
        return formatMetric(
          params.data?.[fund as keyof MetricResultDataItem],
          MetricDisplayType.percent
        );
      },
      comparator: (valueA: number, valueB: number) => {
        if (valueA === null || valueA === undefined) return 1;
        if (valueB === null || valueB === undefined) return -1;
        return valueA - valueB;
      },
      ...createFullPrecisionPercentTooltipProps({
        display_type: MetricDisplayType.percent,
      }),
    } as ColDef<MetricResultDataItem>;
  });

  return [
    getPositionDifferencesColumnMap(metricsCatalog)
      .company_security_code_portfolio_asset_class,
    ...(dynamicColumns as ColDef<MetricResultDataItem>[]),
    getPositionDifferencesColumnMap(metricsCatalog).difference,
  ];
};

export const defaultDataGridProps = {
  defaultColDef: positionDifferencesDefaultColumn,
  sideBar: false,
  groupDefaultExpanded: -1,
  suppressAggFuncInHeader: true,
  animateRows: false,
};

export const autoSizeStrategy: SizeColumnsToFitGridStrategy = {
  type: "fitGridWidth",
};
