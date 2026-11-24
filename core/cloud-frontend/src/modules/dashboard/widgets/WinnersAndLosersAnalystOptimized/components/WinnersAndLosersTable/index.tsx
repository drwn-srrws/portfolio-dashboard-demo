import { GridApi } from "@ag-grid-community/core";

import { RefObject, useMemo } from "react";

import { MetricCatalogItem } from "@api/types/index";
import { DataGrid, DataGridLayout } from "@components/Datagrid/index";

import {
  createWinnersAndLosersColumns,
  autoSizeStrategy,
} from "./WinnersAndLosersTable.columns";

export interface IWinnersAndLosersTableProps {
  gridRefWinners: RefObject<GridApi | null>;
  gridRefLosers: RefObject<GridApi | null>;
  isLoading: boolean;
  groupBy: string;
  winnersRows: Array<Record<string, unknown>>;
  losersRows: Array<Record<string, unknown>>;
  metricsCatalog: MetricCatalogItem[];
  displayColumns: string[];
  testId?: string;
  decimalPrecision?: number;
}

export const WinnersAndLosersTable = ({
  gridRefWinners,
  gridRefLosers,
  isLoading,
  winnersRows,
  losersRows,
  groupBy,
  displayColumns,
  metricsCatalog,
  decimalPrecision = 2,
}: IWinnersAndLosersTableProps) => {
  const columns = useMemo(
    () =>
      createWinnersAndLosersColumns(
        metricsCatalog,
        displayColumns,
        decimalPrecision,
        groupBy
      ),
    [metricsCatalog, displayColumns, decimalPrecision, groupBy]
  );

  const dataGridLayout: DataGridLayout = {
    mode: "responsive",
  };

  const getRowId = useMemo(
    () => (row: Record<string, unknown>) => {
      const id = `${row[groupBy] || ""}-${JSON.stringify(row)}`;
      return id;
    },
    [groupBy]
  );

  return (
    <div className="flex size-full flex-col md:flex-row gap-4">
      <div className="winners-losers-table-ag-grid flex w-full md:w-1/2 flex-col border-none p-0">
        <h6 className="winners-losers-table-ag-grid-header border-b border-solid border-neutral-800 bg-neutral-900 px-3 py-2">
          <span className="text-sm font-medium text-green-100">Winners</span>
        </h6>
        <div className="size-full">
          <DataGrid
            key={`winners-${groupBy}`}
            gridRef={gridRefWinners}
            layout={dataGridLayout}
            rowData={winnersRows}
            columnDefs={columns}
            autoSizeStrategy={autoSizeStrategy}
            getRowId={getRowId}
            rowSelection="multiple"
            loading={isLoading}
          />
        </div>
      </div>
      <div className="winners-losers-table-ag-grid flex w-full md:w-1/2 flex-col border-none p-0">
        <h6 className="winners-losers-table-ag-grid-header border-b border-solid border-neutral-800 bg-neutral-900 px-3 py-2">
          <span className="text-sm font-medium text-red-100">Losers</span>
        </h6>
        <div className="size-full">
          <DataGrid
            key={`losers-${groupBy}`}
            gridRef={gridRefLosers}
            layout={dataGridLayout}
            rowData={losersRows}
            columnDefs={columns}
            autoSizeStrategy={autoSizeStrategy}
            getRowId={getRowId}
            loading={isLoading}
            rowSelection="multiple"
          />
        </div>
      </div>
    </div>
  );
};
