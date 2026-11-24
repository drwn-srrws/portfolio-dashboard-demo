import { useCallback, useMemo } from "react";
import {
  InstrumentResponse as Instrument,
  InstrumentSortField,
} from "@/api/types";
import { Sort } from "@/typings/Sort";
import { createColDefs, initColDef } from "./SecurityGrid.columns";
import { DataGrid, DataGridLayout } from "@/components/Datagrid";
import { SizeColumnsToContentStrategy } from "@ag-grid-community/core";

export interface SecurityGridProps {
  page: number;
  totalPages: number;
  rows: Instrument[];
  sort?: Sort<InstrumentSortField> | null;
  isLoading: boolean;
  isPlaceholderData: boolean;
  disablePublish?: boolean;
  disableProgress?: boolean;
  disableStatus?: boolean;
  testId?: string;
  onSortChange?: (sort: Sort<InstrumentSortField> | null) => void;
}

const autoSizeStrategy: SizeColumnsToContentStrategy = {
  type: "fitCellContents",
};

const getRowId = (row: Instrument) => row.id.toString();

export const SecurityGrid = ({
  rows,
  isLoading,
  isPlaceholderData,
  sort,
  disablePublish,
  disableProgress,
  disableStatus,
  testId,
  onSortChange: onSortChangeProp,
}: SecurityGridProps) => {
  const colDefs = useMemo(
    () => createColDefs(disableStatus, disableProgress, disablePublish),
    [disableStatus, disableProgress, disablePublish]
  );

  const onSortChange = useCallback(
    (sort: Sort<string> | null) => {
      onSortChangeProp?.(sort as Sort<InstrumentSortField> | null);
    },
    [onSortChangeProp]
  );

  const dataGridLayout: DataGridLayout = {
    mode: "responsive",
  };

  return (
    <div className="flex flex-col flex-1" data-testid={testId}>
      <DataGrid
        layout={dataGridLayout}
        rowData={rows}
        sort={sort}
        columnDefs={colDefs}
        loading={isLoading}
        pending={isPlaceholderData}
        defaultColDef={initColDef}
        autoSizeStrategy={autoSizeStrategy}
        rowSelection="multiple"
        sideBar={false}
        onSortChange={onSortChange}
        getRowId={getRowId}
      />
    </div>
  );
};
