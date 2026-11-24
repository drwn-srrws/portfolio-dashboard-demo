import { DataGrid } from "@components/Datagrid/index";

import { createEventColumns, defaultColDef } from "../UpcomingEvents.columns";
import { MetricMetadata, MetricResultDataAnyOfItem } from "@/api/types";
import { useMemo } from "react";

const columnOrderMetrics = [
  "primary_analyst_avatar",
  "date",
  "company_security_code_portfolio_asset_class",
  "estimate",
];

const rowId = (row: MetricResultDataAnyOfItem) => String(row.event_id);

const Table = ({
  data,
  metricsCatalogData,
  isLoading,
}: {
  data: (MetricResultDataAnyOfItem & {
    event_id: number;
  })[];
  metricsCatalogData: MetricMetadata | undefined;
  isLoading: boolean;
}) => {
  const metricsCatalog = useMemo(
    () => metricsCatalogData?.metrics || [],
    [metricsCatalogData]
  );

  const columns = useMemo(
    () => createEventColumns(metricsCatalog, columnOrderMetrics),
    [metricsCatalog]
  );

  return (
    <div className="border-top-no-radius winners-losers-table-ag-grid flex flex-1 flex-col">
      <DataGrid
        getRowId={rowId}
        rowData={data}
        columnDefs={columns}
        loading={isLoading}
        defaultColDef={defaultColDef}
        sideBar={false}
        groupDefaultExpanded={0}
        suppressAggFuncInHeader={true}
        stopEditingWhenCellsLoseFocus={true}
        treeData={false}
        animateRows={false}
        tooltipShowDelay={0}
        tooltipHideDelay={600000}
        tooltipMouseTrack={true}
      />
    </div>
  );
};

export default Table;
