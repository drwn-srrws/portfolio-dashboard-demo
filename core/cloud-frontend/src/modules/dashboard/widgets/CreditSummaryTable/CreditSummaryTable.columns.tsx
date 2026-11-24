import { ValueFormatterParams } from "@ag-grid-community/core";
import { formatDate } from "date-fns";

import { MetricDisplayType } from "@/api/types";
import { formatMetric } from "@/utils/metrics";

import { CreditSummaryEntry } from "./data";

export const columnsDefinitions = [
  {
    colId: "Investment",
    headerName: "Investment Name",
    field: "Investment",
    resizable: true,
  },

  {
    colId: "Entry Date",
    headerName: "Entry Date",
    field: "Entry Date",
    resizable: true,
    valueFormatter: (params: ValueFormatterParams<CreditSummaryEntry>) =>
      formatDate(new Date(params.value), "MMM dd, yyyy"),
  },

  {
    colId: "Exit Date",
    headerName: "Exit Date",
    field: "Exit Date",
    filter: "agDateColumnFilter",
    resizable: true,
    valueFormatter: (params: ValueFormatterParams<CreditSummaryEntry>) =>
      params.value ? formatDate(new Date(params.value), "MMM dd, yyyy") : "-",
  },

  {
    colId: "Invested Cost",
    headerName: "Invested Cost",
    field: "Invested Cost",
    resizable: true,
    valueFormatter: (params: ValueFormatterParams<CreditSummaryEntry>) =>
      formatMetric(params.value, "dollars_regular" as MetricDisplayType),
  },

  {
    colId: "Market Value",
    headerName: "Market Value",
    field: "Market Value",
    resizable: true,
    valueFormatter: (params: ValueFormatterParams<CreditSummaryEntry>) =>
      formatMetric(params.value, "dollars_regular" as MetricDisplayType),
  },

  {
    colId: "% of Total Market Value",
    headerName: "% of Total Market Value",
    field: "% of Total Market Value",
    resizable: true,
    valueFormatter: (params: ValueFormatterParams<CreditSummaryEntry>) =>
      formatMetric(params.value, "percent"),
  },

  {
    colId: "Return of Capital",
    headerName: "Return of Capital",
    field: "Return of Capital",
    resizable: true,
    valueFormatter: (params: ValueFormatterParams<CreditSummaryEntry>) =>
      formatMetric(params.value, "dollars_regular" as MetricDisplayType),
    minWidth: 130,
  },

  {
    colId: "Interest Income",
    headerName: "Interest Income",
    field: "Interest Income",
    resizable: true,
    valueFormatter: (params: ValueFormatterParams<CreditSummaryEntry>) =>
      formatMetric(params.value, "dollars_regular" as MetricDisplayType),
    minWidth: 130,
  },

  {
    colId: "Realized Proceeeds",
    headerName: "Realized Proceeeds",
    field: "Realized Proceeeds",
    resizable: true,
    valueFormatter: (params: ValueFormatterParams<CreditSummaryEntry>) =>
      formatMetric(params.value, "dollars_regular" as MetricDisplayType),
    minWidth: 130,
  },

  {
    colId: "Total Value",
    headerName: "Total Value",
    field: "Total Value",
    resizable: true,
    valueFormatter: (params: ValueFormatterParams<CreditSummaryEntry>) =>
      formatMetric(params.value, "dollars_regular" as MetricDisplayType),
    minWidth: 130,
  },

  {
    colId: "Gross IRR",
    headerName: "Gross IRR",
    field: "Gross IRR",
    resizable: true,
    valueFormatter: (params: ValueFormatterParams<CreditSummaryEntry>) =>
      formatMetric(params.value, "percent"),
    minWidth: 130,
  },

  {
    colId: "Gross MOIC",
    headerName: "Gross MOIC",
    field: "Gross MOIC",
    resizable: true,
    valueFormatter: (params: ValueFormatterParams<CreditSummaryEntry>) =>
      params.value.toFixed(2) + "x",
    minWidth: 130,
  },

  {
    colId: "Net IRR",
    headerName: "Net IRR",
    field: "Net IRR",
    resizable: true,
    valueFormatter: (params: ValueFormatterParams<CreditSummaryEntry>) =>
      formatMetric(params.value, "percent"),
    minWidth: 130,
  },

  {
    colId: "Net MOIC",
    headerName: "Net MOIC",
    field: "Net MOIC",
    resizable: true,
    valueFormatter: (params: ValueFormatterParams<CreditSummaryEntry>) =>
      params.value.toFixed(2) + "x",
    minWidth: 130,
  },

  {
    colId: "ITD PnL",
    headerName: "ITD PnL",
    field: "ITD PnL",
    resizable: true,
    valueFormatter: (params: ValueFormatterParams<CreditSummaryEntry>) =>
      formatMetric(params.value, "dollars_regular" as MetricDisplayType),
    minWidth: 130,
  },

  {
    colId: "% of Total ITD PnL",
    headerName: "% of Total ITD PnL",
    field: "% of Total ITD PnL",
    resizable: true,
    valueFormatter: (params: ValueFormatterParams<CreditSummaryEntry>) =>
      formatMetric(params.value, "percent"),
    minWidth: 130,
  },
];

export const defaultColumns = [
  "Investment",
  "Entry Date",
  "Exit Date",
  "Invested Cost",
  "Market Value",
  "% of Total Market Value",
  "Return of Capital",
  "Interest Income",
  "Realized Proceeeds",
  "Total Value",
  "Gross IRR",
  "Gross MOIC",
  "Net IRR",
  "Net MOIC",
  "ITD PnL",
  "% of Total ITD PnL",
];

export const otherColumns = [];
