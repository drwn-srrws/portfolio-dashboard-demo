import { Path, path } from "ramda";
import { JSX, useState } from "react";
import { SelectedRowsContext } from "./SelectedRowContext";

export const SelectedRowsProvider = <TRow = unknown,>({
  pathToId,
  children,
}: {
  pathToId: Path;
  children: JSX.Element;
}) => {
  const [selectedRows, setSelectedRows] = useState([] as TRow[]);
  const Provider = SelectedRowsContext.Provider;

  const addRow = (row: TRow) => {
    setSelectedRows([...(selectedRows || []), row]);
  };

  const removeRow = (row: TRow) => {
    setSelectedRows(
      (selectedRows || []).filter(
        (r) => path(pathToId, row) !== path(pathToId, r)
      )
    );
  };

  return (
    <Provider
      value={{ selectedRows, addRow, removeRow, setSelectedRows, pathToId }}
    >
      {children}
    </Provider>
  );
};
