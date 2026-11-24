import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";
import { ValueFormatterParams } from "@ag-grid-community/core";

import { MetricResult, MetricDisplayType } from "@api/types/index";

export const winnersAndLosersAutoGroupColumn = {
  flex: 1,
  headerName: "Instrument Group",
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
  resizable: true,
};

export const winnersAndLosersDefaultColumn = {
  flex: 1,
  cellStyle: {
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
  resizable: false,
  headerClass: "dockview-table-header",
  cellRendererParams: {
    suppressCount: true,
  },
  valueFormatter: (params: ValueFormatterParams<MetricResult>) => {
    const value = params.value;
    const count = params.node?.childrenAfterGroup?.length;
    const label = count ? `${value} (${count})` : value;

    return label;
  },
  ...createFullPrecisionPercentTooltipProps({
    display_type: MetricDisplayType.percent,
  }),
};
