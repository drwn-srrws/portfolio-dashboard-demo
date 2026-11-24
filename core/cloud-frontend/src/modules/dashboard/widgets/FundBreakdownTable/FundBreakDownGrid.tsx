import { DataGrid, DataGridLayout } from "@/components/Datagrid";
import { NestedTableEntry } from "@/utils/table";
import {
  autoSizeStrategy,
  defaultDataGridProps,
  getFundBreakdownGroupedColumns,
  getFundBreakdownAutoGroupColumn,
} from "./FundBreakdownTable.columns";
import { memo, useMemo, RefObject } from "react";
import { GridApi } from "@ag-grid-community/core";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import { MetricCatalogItem } from "@api/types/index";

interface FundBreakDownGridProps {
  gridRef: RefObject<GridApi | null>;
  rowData: NestedTableEntry<{
    name: string;
    value: unknown;
  }>[];
  loading: boolean;
  metricsCatalogUnfiltered: Array<MetricCatalogItem>;
}

const getRowId = (data: { uniqueIds: string[] }) => data.uniqueIds.join("-");

const getDataPath = (data: { uniqueIds: string[] }) => data.uniqueIds;

export const FundBreakDownGrid = memo(
  ({
    gridRef,
    rowData,
    loading,
    metricsCatalogUnfiltered,
  }: FundBreakDownGridProps) => {
    const { isMaximized } = usePanelMaximize();

    const dataGridLayout: DataGridLayout = useMemo(
      () => ({
        mode: isMaximized ? "normal" : "responsive",
      }),
      [isMaximized]
    );

    const fundBreakdownGroupedColumns = useMemo(
      () => getFundBreakdownGroupedColumns(metricsCatalogUnfiltered),
      [metricsCatalogUnfiltered]
    );
    const fundBreakdownAutoGroupColumn = useMemo(
      () => getFundBreakdownAutoGroupColumn(metricsCatalogUnfiltered),
      [metricsCatalogUnfiltered]
    );

    return (
      <DataGrid
        gridRef={gridRef}
        layout={dataGridLayout}
        rowData={rowData}
        loading={loading}
        columnDefs={fundBreakdownGroupedColumns}
        autoSizeStrategy={autoSizeStrategy}
        autoGroupColumnDef={fundBreakdownAutoGroupColumn}
        getDataPath={getDataPath}
        rowSelection="multiple"
        getRowId={getRowId}
        {...defaultDataGridProps}
      />
    );
  }
);
