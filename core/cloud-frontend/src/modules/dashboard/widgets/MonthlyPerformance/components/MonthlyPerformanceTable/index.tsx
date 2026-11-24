import { MetricCatalogItem } from "@/api/types";
import { DataGrid, DataGridLayout } from "@components/Datagrid/index";

import {
  autoSizeStrategy,
  createMonthlyPerformanceColumns,
  defaultGridProps,
  getRowId,
} from "./MonthlyPerformanceTable.columns";
import { MonthlyPerformanceTableRow } from "./MonthlyPerformanceTable.utils";
import { MetricDisplayType } from "@/api/types";
import { memo, useMemo } from "react";
import { GridApi } from "@ag-grid-community/core";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";

export interface MonthlyPerformanceTableProps {
  gridRef: React.RefObject<GridApi | null>;
  groupBy: string;
  metricsCatalog: MetricCatalogItem[];
  dateRanges: { start: string; end: string }[];
  metricsCatalogUnfiltered: MetricCatalogItem[];
  formatedData: MonthlyPerformanceTableRow[];
  metricDisplayType: MetricDisplayType;
  metricDescription?: string;
  isLoading: boolean;
}

export const MonthlyPerformanceTable = memo(
  ({
    gridRef,
    groupBy,
    metricsCatalog,
    dateRanges,
    metricsCatalogUnfiltered,
    formatedData,
    metricDisplayType,
    metricDescription,
    isLoading,
  }: MonthlyPerformanceTableProps) => {
    const { isMaximized } = usePanelMaximize();

    const dataGridLayout: DataGridLayout = useMemo(
      () => ({
        mode: isMaximized ? "normal" : "responsive",
      }),
      [isMaximized]
    );

    const columns = useMemo(() => {
      return createMonthlyPerformanceColumns(
        groupBy,
        metricsCatalog,
        dateRanges,
        metricDisplayType,
        metricsCatalogUnfiltered,
        metricDescription
      );
    }, [
      groupBy,
      metricsCatalog,
      dateRanges,
      metricDisplayType,
      metricsCatalogUnfiltered,
      metricDescription,
    ]);

    return (
      <DataGrid
        gridRef={gridRef}
        layout={dataGridLayout}
        loading={isLoading}
        rowData={formatedData}
        columnDefs={columns}
        getRowId={getRowId}
        autoSizeStrategy={autoSizeStrategy}
        {...defaultGridProps}
      />
    );
  }
);
