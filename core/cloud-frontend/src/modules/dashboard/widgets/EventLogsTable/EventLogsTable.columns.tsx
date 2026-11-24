import { ValueFormatterParams } from "@ag-grid-community/core";
import { formatDate } from "date-fns";

import { MetricDisplayType } from "@/api/types";
import { formatMetric } from "@/utils/metrics";

import { EventLogsEntry } from "./data";

export const columnsDefinitions = [
  {
    colId: "Instrument",
    headerName: "Instrument Name",
    field: "Instrument",
    resizable: true,
  },

  {
    colId: "Event Type",
    headerName: "Event Type",
    field: "Event Type",
    resizable: true,
  },

  {
    colId: "Net Cash",
    headerName: "Net Cash",
    field: "Net Cash",
    resizable: true,
    valueFormatter: (params: ValueFormatterParams<EventLogsEntry>) =>
      formatMetric(params.value, "dollars_regular" as MetricDisplayType),
  },

  {
    colId: "Ledger Date",
    headerName: "Ledger Date",
    field: "Ledger Date",
    filter: "agDateColumnFilter",
    resizable: true,
    valueFormatter: (params: ValueFormatterParams<EventLogsEntry>) =>
      formatDate(new Date(params.value), "MMM dd, yyyy"),
  },

  {
    colId: "Fund Code",
    headerName: "Fund Code",
    field: "Fund Code",
    resizable: true,
  },
  {
    colId: "Broker Code",
    headerName: "Broker Code",
    field: "Broker Code",
    resizable: true,
  },
  {
    colId: "Account Code",
    headerName: "Account Code",
    field: "Account Code",
    resizable: true,
  },
];

export const defaultColumns = [
  "Instrument",
  "Event Type",
  "Ledger Date",
  "Net Cash",
  "Fund Code",
  "Broker Code",
  "Account Code",
];

export const otherColumns = [];
