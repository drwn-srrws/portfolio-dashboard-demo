import { memo, useMemo } from "react";
import { Sort } from "@typings/Sort";
import { DataGrid } from "@components/Datagrid/index";
import { Column } from "../../types/Column";

import { defaultColDef, columnDefs } from "../../constants/columnDefs";

import { CoverageRow } from "../../hooks/useGetCoverages";
import { ColDef } from "node_modules/@ag-grid-community/core/dist/types/src/entities/colDef";
import { CustomCellRendererProps } from "@ag-grid-community/react";
import { CoverageActions } from "../CoverageActions";

export interface CoverageGridProps {
  data: CoverageRow[];
  pending?: boolean;
  loading?: boolean;
  sort?: Sort<Column> | null;
  onSortChange?: (sort: Sort<Column> | null) => void;
}

const getRowId = (data: CoverageRow) => `${data.id}`;

export const CoverageGrid = memo(
  ({ data, pending, loading }: CoverageGridProps) => {
    const rows: CoverageRow[] = data;

    const columns = useMemo<ColDef[]>(() => {
      const actionColumn: ColDef = {
        headerName: "Actions",
        field: "actions",
        width: 120,
        sortable: false,
        filter: false,
        cellRenderer: (params: CustomCellRendererProps<CoverageRow>) => {
          const row = params.data as CoverageRow;
          return <CoverageActions row={row} />;
        },
      };

      return [...columnDefs, actionColumn];
    }, []);

    return (
      <DataGrid
        testId="coverage-grid"
        tooltipMouseTrack
        rowData={rows}
        columnDefs={columns}
        loading={loading}
        pending={pending}
        defaultColDef={defaultColDef}
        getRowId={getRowId}
      />
    );
  }
);
