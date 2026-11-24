import { ColDef, GridApi, ValueFormatterParams } from "@ag-grid-community/core";

import { RefObject, useMemo } from "react";

import {
  MetricResultDataAnyOfItem,
  MetricCatalogItem as MetricCatalogItem,
} from "@api/types/index";
import { DataGrid, DataGridLayout } from "@components/Datagrid/index";

import {
  createWinnersAndLosersAnalystsColumns,
  winnersAndLosersAnalystsAutoGroupColumn,
  autoSizeStrategy,
  defaultDataGridProps,
} from "./WinnersAndLosersAnalystsTable.columns";
import { getDataPath, getRowId } from "./WinnersAndLosersAnalystsTable.utils";
import { Avatar } from "@components/Avatar";
import { NestedTableEntry } from "@/utils/table";

export interface IWinnersAndLosersAnalystsTableProps {
  gridRefWinners: RefObject<GridApi | null>;
  gridRefLosers: RefObject<GridApi | null>;
  isLoading: boolean;
  winersRows: NestedTableEntry<MetricResultDataAnyOfItem>[];
  losersRows: NestedTableEntry<MetricResultDataAnyOfItem>[];
  metricsCatalog: MetricCatalogItem[];
  sortByMetric: string;
  analystType?: "primary_analyst" | "secondary_analyst";
  testId?: string;
}

export const WinnersAndLosersAnalystsTable = ({
  gridRefWinners,
  gridRefLosers,
  isLoading,
  winersRows,
  losersRows,
  sortByMetric,
  metricsCatalog,
  analystType = "primary_analyst",
}: IWinnersAndLosersAnalystsTableProps) => {
  const columns = useMemo(
    () => createWinnersAndLosersAnalystsColumns(metricsCatalog, [sortByMetric]),
    [metricsCatalog, sortByMetric]
  );
  const dataGridLayout: DataGridLayout = {
    mode: "responsive",
  };

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    const metric = metricsCatalog.find((m) => m.name === analystType);

    const avatarFieldToUse =
      analystType === "primary_analyst"
        ? "primary_analyst_avatar"
        : "secondary_analyst_avatar";

    return {
      ...winnersAndLosersAnalystsAutoGroupColumn,
      headerName: metric?.display_name,
      headerTooltip: metric?.description || metric?.display_name,
      colId: analystType,
      cellRendererParams: {
        innerRenderer: (
          params: ValueFormatterParams<MetricResultDataAnyOfItem>
        ) => {
          const analystAvatar = String(params.data?.[avatarFieldToUse]);

          const data = {
            email: analystAvatar?.split("|")[0],
            first_name: analystAvatar?.split("|")[1],
            last_name: analystAvatar?.split("|")[2],
          };
          if (params.node?.level === 0) {
            return (
              <div className="flex items-center p-2">
                <Avatar data={data} />
              </div>
            );
          }
          return params.value;
        },
      },
    };
  }, [metricsCatalog, analystType]);

  return (
    <div className="flex size-full flex-col md:flex-row gap-4">
      <div className="winners-losers-table-ag-grid flex w-full md:w-1/2 flex-col border-none p-0">
        <h6 className="winners-losers-table-ag-grid-header border-b border-solid border-neutral-800 bg-neutral-900 px-3 py-2">
          <span className="text-sm font-medium text-green-100">Winners</span>
        </h6>
        <div className="size-full">
          <DataGrid
            key={`winners-${analystType}`}
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
            key={`losers-${analystType}`}
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
