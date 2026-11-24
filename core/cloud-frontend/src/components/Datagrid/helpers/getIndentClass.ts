import { CellClassParams } from "@ag-grid-community/core";

export const getIndentClass = (params: CellClassParams) => {
  let indent = 0;
  let node = params.node;
  while (node && node.parent) {
    indent++;
    node = node.parent;
  }
  return "indent-" + indent;
};
