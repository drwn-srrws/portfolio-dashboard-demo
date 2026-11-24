import {
  ColDef,
  ValueFormatterParams,
  ValueGetterParams,
} from "@ag-grid-community/core";
import { CustomCellRendererProps } from "@ag-grid-community/react";

import { CompanyPageEvent } from "@api/types/index";
import {
  getImpliedDownsideProbability,
  ProbabilitiesToDisplayStrings,
} from "@/typings/Probabilities";

import { numToDollar } from "@/utils/index";
import { createNullableComparator } from "@/components/Datagrid/helpers/createNullableComparator";
import { SoftDateCell } from "@/components/SoftDateCell";

export const eventsColDefs: ColDef[] = [
  {
    headerName: "Event",
    field: "event",
    pinned: "left",
    lockPosition: true,
    lockVisible: true,
    suppressHeaderMenuButton: true,
    cellRenderer: (params: CustomCellRendererProps<CompanyPageEvent>) =>
      params?.data ? params.data.name : null,
    comparator: createNullableComparator<string>((a, b) => a.localeCompare(b)),
  },
  {
    headerName: "Date",
    field: "date",
    comparator: createNullableComparator<string>((a, b) => {
      const aDate = new Date(a);
      const bDate = new Date(b);

      return aDate.getTime() - bDate.getTime();
    }),
    cellRenderer: (params: CustomCellRendererProps<CompanyPageEvent>) => {
      const dateText = params.value ? String(params.value) : "";
      if (!dateText) return dateText;

      return <SoftDateCell formatted={dateText} horizon={params.data} />;
    },
  },
  {
    headerName: "Upside %",
    field: "estimate.upside_percentage",
    valueGetter: (params: ValueGetterParams<CompanyPageEvent>) => {
      const value = params.data?.estimate?.upside_percentage;
      if (typeof value === "number") return value;
      else return "Event has no estimate";
    },
    comparator: createNullableComparator<number | string>(
      (a, b, isDescending) => {
        if (typeof a === "string" && typeof b === "string") return 0;
        if (typeof a === "string") return isDescending ? -1 : 1;
        if (typeof b === "string") return isDescending ? 1 : -1;

        return a - b;
      }
    ),
  },
  {
    headerName: "Upside $",
    field: "estimate.implied_upside_price_usd",
    valueFormatter: (params: ValueFormatterParams<CompanyPageEvent, string>) =>
      params.value ? numToDollar(params.value) : "",
  },
  {
    headerName: "Upside Note",
    field: "estimate.upside_notes",
    comparator: createNullableComparator<string>((a, b) => a.localeCompare(b)),
  },
  {
    headerName: "Downside %",
    field: "estimate.downside_percentage",
    valueGetter: (params: ValueGetterParams<CompanyPageEvent>) => {
      const value = params.data?.estimate?.downside_percentage;
      if (typeof value === "number") return value;
      else return "";
    },
    comparator: createNullableComparator<number | string>(
      (a, b, isDescending) => {
        if (typeof a === "string" && typeof b === "string") return 0;
        if (typeof a === "string") return isDescending ? -1 : 1;
        if (typeof b === "string") return isDescending ? 1 : -1;

        return a - b;
      }
    ),
  },
  {
    headerName: "Downside $",
    field: "estimate.implied_downside_price_usd",
    valueFormatter: (params: ValueFormatterParams<CompanyPageEvent, string>) =>
      params.value ? numToDollar(params.value) : "",
  },
  {
    headerName: "Downside Notes",
    field: "estimate.downside_notes",
    comparator: createNullableComparator<string>((a, b) => a.localeCompare(b)),
  },
  {
    headerName: "POS",
    field: "estimate.upside_probability",
    valueGetter: (params: ValueGetterParams<CompanyPageEvent>) => {
      if (!params.data?.estimate) return null;

      const upside = params.data?.estimate?.upside_probability;
      const impliedDownside = getImpliedDownsideProbability(upside);
      return ProbabilitiesToDisplayStrings[impliedDownside];
    },
    comparator: createNullableComparator<string>((a, b) => a.localeCompare(b)),
  },
];
