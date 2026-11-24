import { ColDef } from "@ag-grid-community/core";
import { CompanyRow } from "../helpers/mapCompaniesToRows";

export const orderColumnsByConfig = (
  columns: ColDef<CompanyRow>[],
  columnOrder?: string[]
): ColDef<CompanyRow>[] => {
  if (!columnOrder || columnOrder.length === 0) {
    return columns;
  }
  const columnMap = new Map<string, ColDef<CompanyRow>>();
  columns.forEach((column) => {
    columnMap.set(column.colId!, column);
  });

  return columnOrder.map((columnId) => columnMap.get(columnId)!);
};
