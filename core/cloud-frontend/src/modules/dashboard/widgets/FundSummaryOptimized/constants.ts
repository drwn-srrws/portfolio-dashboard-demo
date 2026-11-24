import { SizeColumnsToFitGridStrategy } from "@ag-grid-community/core";

export const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

export const autoSizeStrategy: SizeColumnsToFitGridStrategy = {
  type: "fitGridWidth",
};

export const defaultDataGridProps = {
  defaultColDef: {
    flex: 1,
    minWidth: 70,
    cellStyle: defaultStyle,
    resizable: false,
    headerClass: "dockview-table-header",
  },
  sideBar: false,
  suppressAggFuncInHeader: true,
  animateRows: false,
};
