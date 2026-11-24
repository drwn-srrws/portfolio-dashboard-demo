import { ColDef, GridApi, ValueFormatterParams } from "@ag-grid-community/core";

import { RefObject, useMemo } from "react";

import {
  MetricResultDataAnyOfItem,
  MetricCatalogItem as MetricCatalogItem,
} from "@api/types/index";
import { DataGrid, DataGridLayout } from "@components/Datagrid/index";

import {
  createWinnersAndLosersColumns,
  winnersAndLosersAutoGroupColumn,
  autoSizeStrategy,
  defaultDataGridProps,
} from "./WinnersAndLosersTable.columns";
import { getDataPath, getRowId } from "./WinnersAndLosersTable.utils";
import { Avatar } from "@components/Avatar";
import { NestedTableEntry } from "@/utils/table";

export interface IWinnersAndLosersTableProps {
  gridRefWinners: RefObject<GridApi | null>;
  gridRefLosers: RefObject<GridApi | null>;
  isLoading: boolean;
  groupBy: string;
  winersRows: NestedTableEntry<MetricResultDataAnyOfItem>[];
  losersRows: NestedTableEntry<MetricResultDataAnyOfItem>[];
  metricsCatalog: MetricCatalogItem[];
  sortByMetric: string;
  testId?: string;
  decimalPrecision?: number;
}

export const WinnersAndLosersTable = ({
  gridRefWinners,
  gridRefLosers,
  isLoading,
  winersRows,
  losersRows,
  groupBy,
  sortByMetric,
  metricsCatalog,
  decimalPrecision = 2,
}: IWinnersAndLosersTableProps) => {
  const columns = useMemo(
    () =>
      createWinnersAndLosersColumns(
        metricsCatalog,
        [sortByMetric],
        decimalPrecision
      ),
    [metricsCatalog, sortByMetric, decimalPrecision]
  );
  const dataGridLayout: DataGridLayout = {
    mode: "responsive",
  };

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    const metric = metricsCatalog.find((m) => m.name === groupBy);

    return {
      ...winnersAndLosersAutoGroupColumn,
      headerName: metric?.display_name || groupBy,
      headerTooltip: metric?.description || metric?.display_name || groupBy,
      colId: groupBy,
      cellRendererParams: {
        innerRenderer: (
          params: ValueFormatterParams<MetricResultDataAnyOfItem>
        ) => {
          if (groupBy === "primary_analyst") {
            const primaryAnalystAvatar = String(
              params.data?.primary_analyst_avatar
            );

            const data = {
              email: primaryAnalystAvatar?.split("|")[0],
              first_name: primaryAnalystAvatar?.split("|")[1],
              last_name: primaryAnalystAvatar?.split("|")[2],
            };
            if (params.node?.level === 0) {
              return (
                <div className="flex items-center p-2">
                  <Avatar data={data} />
                </div>
              );
            }
            return params.value;
          }
          return params.value;
        },
      },
    };
  }, [metricsCatalog, groupBy]);

  return (
    <div className="flex size-full flex-col md:flex-row gap-4">
      <div className="winners-losers-table-ag-grid flex w-full md:w-1/2 flex-col border-none p-0">
        <h6 className="winners-losers-table-ag-grid-header border-b border-solid border-neutral-800 bg-neutral-900 px-3 py-2">
          <span className="text-sm font-medium text-green-100">Winners</span>
        </h6>
        <div className="size-full">
          <DataGrid
            gridRef={gridRefWinners}
            layout={dataGridLayout}
            rowData={winersRows}
            columnDefs={columns}
            autoSizeStrategy={autoSizeStrategy}
            autoGroupColumnDef={autoGroupColumnDef}
            getRowId={getRowId}
            getDataPath={getDataPath}
            rowSelection="multiple"
            loading={isLoading}
            {...defaultDataGridProps}
          />
        </div>
      </div>
      <div className="winners-losers-table-ag-grid flex w-full md:w-1/2 flex-col border-none p-0">
        <h6 className="winners-losers-table-ag-grid-header border-b border-solid border-neutral-800 bg-neutral-900 px-3 py-2">
          <span className="text-sm font-medium text-red-100">Losers</span>
        </h6>
        <div className="size-full">
          <DataGrid
            gridRef={gridRefLosers}
            layout={dataGridLayout}
            rowData={losersRows}
            columnDefs={columns}
            autoSizeStrategy={autoSizeStrategy}
            autoGroupColumnDef={autoGroupColumnDef}
            getDataPath={getDataPath}
            getRowId={getRowId}
            loading={isLoading}
            rowSelection="multiple"
            {...defaultDataGridProps}
          />
        </div>
      </div>
    </div>
  );
};
