import { useMemo, useRef } from "react";
import { GridApi } from "@ag-grid-community/core";

import { DataGrid } from "@/components/Datagrid/Datagrid";
import {
  createDrugProgramColumnDefs,
  defaultDrugProgramColDef,
} from "../../constants/columnDefs";
import { CompanyRow, DrugProgramRow } from "../../helpers/mapCompaniesToRows";

interface DrugProgramsDetailGridProps {
  data: CompanyRow;
}

export const DrugProgramsDetailGrid = ({
  data,
}: DrugProgramsDetailGridProps) => {
  const gridRef = useRef<GridApi | null>(null);
  const rows = useMemo<DrugProgramRow[]>(() => data?.children ?? [], [data]);
  const columnDefs = useMemo(() => createDrugProgramColumnDefs(), []);

  return (
    <section className="flex h-full flex-col px-2 pb-4 pt-1">
      <header className="flex items-center justify-between pb-2">
        <div className="text-sm text-neutral-400">
          {data?.name} — Drug Programs ({rows.length})
        </div>
      </header>
      <div className="flex-1">
        <DataGrid<DrugProgramRow>
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDef={defaultDrugProgramColDef}
          layout={{ mode: "normal" }}
          gridRef={gridRef}
          getRowId={(row) => row.path.join(".")}
          pending={false}
        />
      </div>
    </section>
  );
};
