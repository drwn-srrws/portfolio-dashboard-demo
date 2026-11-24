import { ColDef, ICellRendererParams } from "@ag-grid-community/core";
import { InstrumentGroupSecurity } from "../InstrumentGroups";
import { InstrumentGroupActions } from "../InstrumentGroupActions";

export const autoGroupColumnDef: ColDef<InstrumentGroupSecurity> = {
  headerName: `Group`,
  field: "name",
  resizable: true,
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
  comparator: () => 0,
};

export const colDefs: ColDef<InstrumentGroupSecurity>[] = [
  {
    field: "id",
    headerName: "ID",
    maxWidth: 100,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    comparator: () => 0,
  },
  {
    cellRenderer: ({ data }: ICellRendererParams<InstrumentGroupSecurity>) => {
      if (!data || !data.instruments) return null;
      return <InstrumentGroupActions data={data} />;
    },
    sortable: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    comparator: () => 0,
  },
];
