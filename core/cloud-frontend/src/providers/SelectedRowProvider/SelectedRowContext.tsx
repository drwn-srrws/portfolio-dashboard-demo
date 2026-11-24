import { Path } from "ramda";
import { createContext } from "react";

export interface ISelectedRowsContext<TRow> {
  selectedRows: TRow[];
  setSelectedRows: (event: TRow[] | null) => void;
  addRow: (row: TRow) => void;
  removeRow: (row: TRow) => void;
  pathToId?: Path;
}

export const SelectedRowsContext = createContext({});
