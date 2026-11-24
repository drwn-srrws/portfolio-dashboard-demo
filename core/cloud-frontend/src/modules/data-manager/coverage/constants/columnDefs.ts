import { ColDef } from "@ag-grid-community/core";
import { Column } from "../types/Column";
import { CoverageRow } from "../hooks/useGetCoverages";
import { hyphenatedDate, toTitleCase } from "@/utils";
import { createNullableComparator } from "@/components/Datagrid/helpers/createNullableComparator";

export const defaultColDef: ColDef<CoverageRow> = {
  flex: 1,
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
};

export const columnDefs: ColDef<CoverageRow>[] = [
  {
    colId: Column.company,
    field: "company",
    headerName: "Company",
    minWidth: 175,
    valueGetter: (params) => params.data?.company.display_name,
    valueFormatter: (params) => params.value,
    comparator: createNullableComparator<string>((a, b) => a.localeCompare(b)),
  },
  {
    colId: Column.primary_analyst,
    field: "primary_analyst",
    headerName: "Analyst",
    minWidth: 175,
    valueGetter: (params) =>
      params.data?.primary_analyst.first_name +
      " " +
      params.data?.primary_analyst.last_name,
    comparator: createNullableComparator<string>((a, b) => a.localeCompare(b)),
  },
  {
    colId: Column.coverage_type,
    field: "coverage_type",
    headerName: "Coverage Type",
    minWidth: 175,
    valueFormatter: (params) => toTitleCase(params.value as string),
    comparator: createNullableComparator<string>((a, b) => a.localeCompare(b)),
  },
  {
    colId: Column.effective_start_date,
    field: "effective_start_date",
    headerName: "Effective Start Date",
    sortingOrder: ["desc", null],
    minWidth: 175,
    comparator: createNullableComparator<string>((a, b) => {
      const aDate = new Date(a);
      const bDate = new Date(b);

      return aDate.getTime() - bDate.getTime();
    }),
  },
  {
    colId: Column.effective_end_date,
    sortingOrder: ["desc", null],
    field: "effective_end_date",
    headerName: "Effective End Date",
    minWidth: 175,
    valueFormatter: (params) =>
      params.value ? hyphenatedDate(params.value) : "",
    comparator: createNullableComparator<string>((a, b) => {
      const aDate = new Date(a);
      const bDate = new Date(b);

      return aDate.getTime() - bDate.getTime();
    }),
  },
];
