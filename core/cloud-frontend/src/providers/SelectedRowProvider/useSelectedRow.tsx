import { useContext } from "react";
import {
  ISelectedRowsContext,
  SelectedRowsContext,
} from "./SelectedRowContext";

export const useSelectedRows = <TRow = unknown,>() => {
  const context = useContext(SelectedRowsContext) as ISelectedRowsContext<TRow>;

  if (!context) {
    throw new Error("useSelectedRow must be used within a SelectedRowProvider");
  }

  return context;
};
