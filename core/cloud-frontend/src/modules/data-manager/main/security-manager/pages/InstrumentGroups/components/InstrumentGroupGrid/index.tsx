import { InstrumentGroupSortField } from "@/api/types";
import { Sort } from "@/typings/Sort";
import { useCallback } from "react";

import { colDefs, autoGroupColumnDef } from "./InstrumentGroup.columns";
import { InstrumentGroupSecurity } from "../InstrumentGroups";
import { DataGrid, DataGridLayout } from "@/components/Datagrid";
import { SizeColumnsToContentStrategy } from "@ag-grid-community/core";

export interface InstrumentGroupGridProps {
  page: number;
  totalPages: number;
  rows: {
    id: number;
    name: string;
    uniqueIds: string[];
  }[];
  disablePublish?: boolean;
  isLoading: boolean;
  isPlaceholderData: boolean;
  sort?: Sort<InstrumentGroupSortField> | null;
  onSortChange?: (sort: Sort<InstrumentGroupSortField> | null) => void;
  onPageChange?: (page: number) => void;
}

const autoSizeStrategy: SizeColumnsToContentStrategy = {
  type: "fitCellContents",
};

const getDataPath = (row: InstrumentGroupSecurity) => row.uniqueIds;
const getRowId = (row: InstrumentGroupSecurity) => row.uniqueIds.join("-");

export const InstrumentGroupGrid = ({
  rows,
  isLoading,
  isPlaceholderData,
  sort,
  onSortChange: onSortChangeProp,
}: InstrumentGroupGridProps) => {
  const onSortChange = useCallback(
    (sort: Sort<string> | null) => {
      onSortChangeProp?.(sort as Sort<InstrumentGroupSortField> | null);
    },
    [onSortChangeProp]
  );

  const dataGridLayout: DataGridLayout = {
    mode: "responsive",
  };

  return (
    <DataGrid
      testId="instrument-groups-table"
      layout={dataGridLayout}
      rowData={rows}
      columnDefs={colDefs}
      autoSizeStrategy={autoSizeStrategy}
      loading={isLoading}
      pending={isPlaceholderData}
      sort={sort}
      onSortChange={onSortChange}
      treeData={true}
      rowSelection="multiple"
      getDataPath={getDataPath}
      getRowId={getRowId}
      autoGroupColumnDef={autoGroupColumnDef}
    />
  );
};
