import { DataGrid, DataGridLayout } from "@components/Datagrid/index";

import { winnersAndLosersDefaultColumn } from "./WinnersAndLosersTable.columns";
import {
  ValueFormatterParams,
  SizeColumnsToFitGridStrategy,
} from "@ag-grid-community/core";
import { formatMetric } from "@/utils/metrics";
import { cellColor } from "@/utils/ag-grid/cells";
import { WinnersAndLosersRow } from "../../hooks/useWinnersAndLosers";
import { useMemo, RefObject } from "react";
import { GridApi } from "@ag-grid-community/core";

const defaultDataGridProps = {
  defaultColDef: {
    ...winnersAndLosersDefaultColumn,
    valueFormatter: (params: ValueFormatterParams<WinnersAndLosersRow>) => {
      const value = params.value;
      const count = params.node?.childrenAfterGroup?.length;
      return count ? `${value} (${count})` : value;
    },
  },
  sideBar: false,
  groupDefaultExpanded: 0,
  suppressAggFuncInHeader: true,
  animateRows: false,
};

const autoSizeStrategy: SizeColumnsToFitGridStrategy = {
  type: "fitGridWidth",
};

export interface IWinnersAndLosersTableProps {
  gridRefWinners: RefObject<GridApi | null>;
  gridRefLosers: RefObject<GridApi | null>;
  isLoadingWinners: boolean;
  isLoadingLosers: boolean;
  winnersRows: WinnersAndLosersRow[];
  losersRows: WinnersAndLosersRow[];
  sortByMetric: string;
}
const emptyDataPath = () => [];
const getRowId = (row: WinnersAndLosersRow) => String(row.id);

export const WinnersAndLosersTable = ({
  gridRefWinners,
  gridRefLosers,
  isLoadingWinners,
  isLoadingLosers,
  winnersRows,
  losersRows,
  sortByMetric,
}: IWinnersAndLosersTableProps) => {
  const colDefs = useMemo(
    () => [
      {
        colId: "name",
        headerName: "Company",
        field: "name",
        resizable: true,
        suppressHeaderMenuButton: true,
        suppressHeaderFilterButton: true,
      },
      {
        colId: sortByMetric,
        headerName: "YTD Return (%)",
        field: sortByMetric,
        resizable: true,
        suppressHeaderMenuButton: true,
        suppressHeaderFilterButton: true,
        valueFormatter: (params: ValueFormatterParams<WinnersAndLosersRow>) => {
          return formatMetric(Number(params.value), "percent");
        },
        cellStyle: ({ data }: { data: Record<string, unknown> }) => {
          return {
            color:
              Number(data[sortByMetric]) >= 0
                ? cellColor["positive"]
                : cellColor["negative"],
          };
        },
      },
    ],
    [sortByMetric]
  );

  const dataGridLayout: DataGridLayout = {
    mode: "responsive",
  };

  return (
    <div className="flex size-full flex-col md:flex-row gap-4">
      <div className="border-top-no-radius winners-losers-table-ag-grid flex w-full md:w-1/2 flex-col">
        <div className="winners-losers-table-ag-grid-header border-b border-solid border-neutral-800 bg-neutral-900 px-3 py-2">
          <span className={`text-sm font-medium text-green-100`}>Winners</span>
        </div>

        <DataGrid
          gridRef={gridRefWinners}
          layout={dataGridLayout}
          autoSizeStrategy={autoSizeStrategy}
          rowData={winnersRows}
          columnDefs={colDefs}
          loading={isLoadingWinners}
          getRowId={getRowId}
          {...defaultDataGridProps}
          getDataPath={emptyDataPath}
          rowSelection="multiple"
        />
      </div>

      <div className="border-top-no-radius winners-losers-table-ag-grid flex w-full md:w-1/2 flex-col">
        <div className="winners-losers-table-ag-grid-header border-b border-solid border-neutral-800 bg-neutral-900 px-3 py-2">
          <span className={`text-sm font-medium text-red-100`}>Losers</span>
        </div>

        <DataGrid
          gridRef={gridRefLosers}
          layout={dataGridLayout}
          autoSizeStrategy={autoSizeStrategy}
          rowData={losersRows}
          columnDefs={colDefs}
          loading={isLoadingLosers}
          getRowId={getRowId}
          {...defaultDataGridProps}
          getDataPath={emptyDataPath}
          rowSelection="multiple"
        />
      </div>
    </div>
  );
};
