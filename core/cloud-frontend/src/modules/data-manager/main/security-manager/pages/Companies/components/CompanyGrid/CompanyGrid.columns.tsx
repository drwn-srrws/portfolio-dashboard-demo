import { ColDef, ICellRendererParams } from "@ag-grid-community/core";

import { CompanyActions } from "../CompanyActions";
import { CompanySecurity } from "../Companies";

export const colDefs: ColDef<CompanySecurity>[] = [
  {
    field: "name",
    headerName: "Company Name",
    minWidth: 200,
    resizable: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    comparator: () => 0,
    cellRenderer: "agGroupCellRenderer",
    cellRendererParams: {
      suppressCount: true,
    },
  },
  {
    field: "id",
    headerName: "ID",
    valueFormatter: (params) => params.value.toString(),
    maxWidth: 100,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    comparator: () => 0,
  },
  {
    cellRenderer: ({ data }: ICellRendererParams<CompanySecurity>) => {
      if (!data || !data.instruments) return null;
      return <CompanyActions data={data} />;
    },
    sortable: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    comparator: () => 0,
  },
];
