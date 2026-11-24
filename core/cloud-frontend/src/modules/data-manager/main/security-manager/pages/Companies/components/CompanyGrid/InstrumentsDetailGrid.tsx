import { useMemo, useRef } from "react";
import { GridApi } from "@ag-grid-community/core";

import { DataGrid } from "@/components/Datagrid/Datagrid";
import { CompanyInstrumentResponse as Instrument } from "@/api/types";
import { createInstrumentsDetailColumns } from "./InstrumentsDetailGrid.columns";
import { CompanySecurity } from "../Companies";

interface InstrumentsDetailGridProps {
  data: CompanySecurity;
}

export const InstrumentsDetailGrid = ({ data }: InstrumentsDetailGridProps) => {
  const gridRef = useRef<GridApi | null>(null);
  const instruments = useMemo(
    () => (data?.instruments || []) as Instrument[],
    [data]
  );

  const columns = useMemo(() => createInstrumentsDetailColumns(), []);

  return (
    <section className="flex h-full flex-col px-2 pb-4 pt-1">
      <header className="flex items-center justify-between pb-2">
        <div className="text-sm text-neutral-400">
          {data?.name} — Instruments
        </div>
      </header>
      <div className="flex-1">
        <DataGrid
          rowData={instruments}
          columnDefs={columns}
          layout={{ mode: "normal" }}
          gridRef={gridRef}
          getRowId={(row) => String(row.id)}
          loading={false}
          pending={false}
        />
      </div>
    </section>
  );
};
