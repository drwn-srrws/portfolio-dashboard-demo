import {
  SizeColumnsToFitGridStrategy,
  RowClassParams,
} from "@ag-grid-community/core";
import { FundPerformanceRow } from "./transformData";

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

const fundPerformanceDefaultColumn = {
  flex: 1,
  minWidth: 70,
  cellStyle: defaultStyle,
  resizable: true,
  headerClass: "dockview-table-header",
};

export const defaultDataGridProps = {
  defaultColDef: fundPerformanceDefaultColumn,
  sideBar: false,
  suppressAggFuncInHeader: true,
  animateRows: false,
  rowClassRules: {
    "fund-performance-separator": (
      params: RowClassParams<FundPerformanceRow>
    ) => {
      return params.data?.isLastFund === true;
    },
  },
};

export const autoSizeStrategy: SizeColumnsToFitGridStrategy = {
  type: "fitGridWidth",
};
