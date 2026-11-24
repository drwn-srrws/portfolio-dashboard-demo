import { useMemo, memo } from "react";
import {
  GridApi,
  GridState,
  SizeColumnsToFitGridStrategy,
} from "@ag-grid-community/core";

import { MetricCatalogItem } from "@api/types";
import {
  createAutoGroupColumnDef,
  createPortfolioSummaryColumns,
  PortfolioSummaryTableRow,
} from "./PortfolioSummaryTable.columns";

import { DataGrid, DataGridLayout } from "@components/Datagrid/index";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";

export interface PortfolioSummaryTableProps {
  gridRef: React.RefObject<GridApi | null>;
  rows: PortfolioSummaryTableRow[];
  metricsCatalog: MetricCatalogItem[];
  columnsOrder: string[];
  groupByFieldName?: string;
  groupByFieldDescription?: string;
  defaultSortByMetric: string;
  defaultSortDirection: "asc" | "desc";
  isLoading: boolean;
}

const autoSizeStrategy: SizeColumnsToFitGridStrategy = {
  type: "fitGridWidth",
};

const getRowId = (data: PortfolioSummaryTableRow) => `${data.uniqueIds}`;
const getDataPath = (data: PortfolioSummaryTableRow) => data.uniqueIds;

export const PortfolioSummaryTable = memo(
  ({
    gridRef,
    metricsCatalog,
    columnsOrder,
    rows,
    groupByFieldName,
    defaultSortByMetric,
    defaultSortDirection,
    groupByFieldDescription,
    isLoading,
  }: PortfolioSummaryTableProps) => {
    const { isMaximized } = usePanelMaximize();

    const colDefs = useMemo(
      () => createPortfolioSummaryColumns(metricsCatalog, columnsOrder),
      [metricsCatalog, columnsOrder]
    );

    const autoGroupColumnDef = useMemo(
      () => createAutoGroupColumnDef(groupByFieldName, groupByFieldDescription),
      [groupByFieldName, groupByFieldDescription]
    );

    const initialState: GridState = useMemo(
      () => ({
        sort: {
          sortModel: [
            {
              colId: defaultSortByMetric,
              sort: defaultSortDirection,
            },
          ],
        },
      }),
      [defaultSortByMetric, defaultSortDirection]
    );

    const dataGridLayout: DataGridLayout = useMemo(
      () => ({
        mode: isMaximized ? "normal" : "responsive",
      }),
      [isMaximized]
    );

    return (
      <DataGrid
        gridRef={gridRef}
        layout={dataGridLayout}
        rowData={rows}
        loading={isLoading}
        columnDefs={colDefs}
        autoGroupColumnDef={autoGroupColumnDef}
        autoSizeStrategy={autoSizeStrategy}
        sideBar={false}
        suppressAggFuncInHeader={true}
        animateRows={false}
        treeData={true}
        initialState={initialState}
        tooltipShowDelay={0}
        tooltipHideDelay={600000}
        groupDefaultExpanded={0}
        getRowId={getRowId}
        getDataPath={getDataPath}
      />
    );
  }
);
