import { ColDef } from "@ag-grid-community/core";
import { dollarsToUnit, millions, numToDollar } from "@/utils/index";

export const portfolioAnalyticsColDefs: ColDef[] = [
  {
    field: "fund",
    headerName: "Fund",
  },
  {
    field: "size",
    headerName: "Size",
    type: "percent",
    valueGetter: (params: { data: { size: number } }) =>
      params.data ? params.data.size * 100 : 0,
  },
  {
    field: "mtd",
    headerName: "MTD PnL ($MM)",
    cellDataType: "number",
    cellRenderer: (params: { data: string; value: string }) => {
      if (!params.data || !params.value) return "";

      const isPositive = parseFloat(params.value) > 0;

      return (
        <span
          className={`${
            isPositive ? "text-green-500" : "text-red-500"
          } font-semibold`}
        >
          {!isPositive ? "(" : ""}
          {numToDollar(dollarsToUnit(parseFloat(params.value), millions))}
          {!isPositive ? ")" : ""}
        </span>
      );
    },
  },
  {
    field: "qtd",
    headerName: "QTD PnL ($MM)",
    cellDataType: "number",
    cellRenderer: (params: { data: string; value: string }) => {
      if (!params.data || !params.value) return "";

      const isPositive = parseFloat(params.value) > 0;

      return (
        <span
          className={`${
            isPositive ? "text-green-500" : "text-red-500"
          } font-semibold`}
        >
          {!isPositive ? "(" : ""}
          {numToDollar(dollarsToUnit(parseFloat(params.value), millions))}
          {!isPositive ? ")" : ""}
        </span>
      );
    },
  },
  {
    field: "ytd",
    headerName: "YTD PnL ($MM)",
    cellDataType: "number",
    cellRenderer: (params: { data: string; value: string }) => {
      if (!params.data || !params.value) return "";

      const isPositive = parseFloat(params.value) > 0;

      return (
        <span
          className={`${
            isPositive ? "text-green-500" : "text-red-500"
          } font-semibold`}
        >
          {!isPositive ? "(" : ""}
          {numToDollar(dollarsToUnit(parseFloat(params.value), millions))}
          {!isPositive ? ")" : ""}
        </span>
      );
    },
  },
];
