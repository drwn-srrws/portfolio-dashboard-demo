import { useCallback } from "react";

import { CompanySort } from "@/api/types";
import { Sort } from "@/typings/Sort";
import { CompanySecurity } from "../Companies";

import { colDefs } from "./CompanyGrid.columns";
import { DataGrid, DataGridLayout } from "@/components/Datagrid";
import { SizeColumnsToContentStrategy } from "@ag-grid-community/core";
import { InstrumentsDetailGrid } from "./InstrumentsDetailGrid";

export interface CompanyGridProps {
  rows: CompanySecurity[];
  disablePublish?: boolean;
  isLoading: boolean;
  isPlaceholderData: boolean;
  sort?: Sort<CompanySort> | null;
  onSortChange?: (sort: Sort<CompanySort> | null) => void;
}

const autoSizeStrategy: SizeColumnsToContentStrategy = {
  type: "fitCellContents",
};

const getRowId = (row: CompanySecurity) => row.id;

export const CompanyGrid = ({
  rows,
  isLoading,
  isPlaceholderData,
  sort,
  onSortChange: onSortChangeProp,
}: CompanyGridProps) => {
  const onSortChange = useCallback(
    (sort: Sort<string> | null) => {
      onSortChangeProp?.(sort as Sort<CompanySort> | null);
    },
    [onSortChangeProp]
  );

  const dataGridLayout: DataGridLayout = {
    mode: "responsive",
  };

  const isRowMaster = useCallback((data: CompanySecurity) => {
    return !!(data?.instruments && data.instruments.length > 0);
  }, []);

  return (
    <DataGrid
      testId="companies-table"
      layout={dataGridLayout}
      rowData={rows}
      columnDefs={colDefs}
      autoSizeStrategy={autoSizeStrategy}
      loading={isLoading}
      pending={isPlaceholderData}
      sort={sort}
      onSortChange={onSortChange}
      rowSelection="multiple"
      getRowId={getRowId}
      masterDetail={true}
      isRowMaster={isRowMaster}
      detailCellRenderer={InstrumentsDetailGrid}
    />
  );
};
