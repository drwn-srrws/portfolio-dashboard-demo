import { DataGrid, DataGridLayout } from "@components/Datagrid/index";

import { createEventColumns, defaultColDef } from "../EventsTable.columns";
import { MetricMetadata, MetricResultDataAnyOfItem } from "@/api/types";
import { formatMetric } from "@/utils/metrics";
import { useMemo, RefObject } from "react";
import { GridApi } from "@ag-grid-community/core";

const columnOrderMetrics = [
  "primary_analyst_avatar",
  "date",
  "company_security_code",
  "event_name",
  "event_estimate_last_updated_date",
  "num_estimates",
  "estimate",
  "event_estimate_upside_probability",
  "event_estimate_upside_nav_impact",
  "event_estimate_downside_nav_impact",
  "event_estimate_up_down_ratio",
  "event_estimate_1_week_actual_nav_impact",
  "event_estimate_2_week_actual_nav_impact",
  "event_estimate_4_week_actual_nav_impact",
];
// The other 6 event_ivol_* fields stack into their sibling analyst columns
// (estimate, upside_probability, up/down_nav_impact) rather than being
// their own columns — see EventsTable.columns.tsx.
const ivolColumnOrderMetrics = ["event_ivol_analyst_stoplights"];
const preferredOrder = [
  "event_num_events",
  "event_num_wins",
  "event_num_losses",
  "event_win_percentage",
  "event_loss_percentage",
];

const rowId = (row: MetricResultDataAnyOfItem) => String(row.event_id);

const Table = ({
  gridRef,
  quarter,
  year,
  stats,
  data,
  metricsCatalogData,
  isIvolEnabled,
}: {
  gridRef: RefObject<GridApi | null>;
  quarter: string;
  year: string;
  data: (MetricResultDataAnyOfItem & {
    event_id: number;
  })[];
  stats: MetricResultDataAnyOfItem;
  metricsCatalogData: MetricMetadata | undefined;
  isIvolEnabled?: boolean;
}) => {
  const metricsCatalog = useMemo(
    () => metricsCatalogData?.metrics || [],
    [metricsCatalogData]
  );

  const columns = useMemo(() => {
    if (!isIvolEnabled)
      return createEventColumns(metricsCatalog, columnOrderMetrics);

    const eventNameIndex = columnOrderMetrics.indexOf("event_name");
    const orderWithIvol = [
      ...columnOrderMetrics.slice(0, eventNameIndex + 1),
      ...ivolColumnOrderMetrics,
      ...columnOrderMetrics.slice(eventNameIndex + 1),
    ];
    return createEventColumns(metricsCatalog, orderWithIvol, isIvolEnabled);
  }, [metricsCatalog, isIvolEnabled]);

  const metrics = useMemo(
    () =>
      Object.keys(stats).map((key) => ({
        value: stats[key],
        key,
        metric: metricsCatalog.find((m) => m.name === key),
      })),
    [stats, metricsCatalog]
  );

  const formattedMetrics = useMemo(
    () =>
      metrics
        .map(({ key, value, metric }) => ({
          key,
          label: metric?.display_name,
          value: metric?.display_type
            ? formatMetric(value, metric?.display_type)
            : value,
        }))
        .sort(
          (a, b) =>
            preferredOrder.indexOf(a.key) - preferredOrder.indexOf(b.key)
        ),
    [metrics]
  );

  const dataGridLayout: DataGridLayout = {
    mode: "responsive",
  };

  return (
    <div
      key={quarter}
      className="border-top-no-radius winners-losers-table-ag-grid flex flex-1 flex-col"
    >
      <div className="flex items-center justify-between bg-neutral-800 p-3 gap-y-2 gap-x-4 flex-wrap">
        <>
          <div className="flex gap-2">
            <div className="flex font-semibold">
              {quarter} {year}
            </div>
          </div>
        </>
        <div className="flex gap-y-1  gap-x-4 md:gap-4 flex-wrap">
          {formattedMetrics.map(({ key, label, value }) => (
            <div key={key} className="flex font-semibold">
              <div className="text-neutral-400 flex items-center gap-1">
                <span className="font-semibold">{label}</span>{" "}
                <span className="font-semibold text-white">
                  {String(value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <DataGrid
        gridRef={gridRef}
        layout={dataGridLayout}
        getRowId={rowId}
        rowData={data}
        columnDefs={columns}
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
