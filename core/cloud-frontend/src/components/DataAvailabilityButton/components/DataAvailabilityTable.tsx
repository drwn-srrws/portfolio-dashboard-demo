import { DataGrid } from "@components/Datagrid";
import { ColDef } from "@ag-grid-community/core";
import type { DataFreshnessItem } from "@/api/types";
import { formatDate, formatDateTime } from "../utils";

interface DataAvailabilityTableProps {
  data: DataFreshnessItem[];
  isLoading?: boolean;
}
const getRowId = (item: DataFreshnessItem) =>
  `${item.table_name}-${item.data_type}`;

const columnDefs: ColDef[] = [
  {
    headerName: "Data",
    field: "data_type",
    flex: 1,
    sortable: true,
    filter: true,
  },
  {
    headerName: "Latest Date",
    field: "latest_date",
    flex: 1,
    sortable: true,
    filter: true,
    valueFormatter: (params) => formatDate(params.value),
  },
  {
    headerName: "Source",
    field: "source",
    flex: 1,
    sortable: true,
    filter: true,
  },
  {
    headerName: "Notes",
    field: "notes",
    flex: 2,
    sortable: true,
    filter: true,
    wrapText: true,
    autoHeight: true,
    cellClass: "notes-cell",
  },
  {
    headerName: "Last Updated At",
    field: "last_updated_at",
    flex: 1,
    sortable: true,
    filter: true,
    valueFormatter: (params) => formatDateTime(params.value),
  },
];

export const DataAvailabilityTable = ({
  data,
  isLoading = false,
}: DataAvailabilityTableProps) => {
  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid
        layout={{ mode: "responsive" }}
        rowData={data}
        columnDefs={columnDefs}
        loading={isLoading}
        getRowId={getRowId}
        defaultColDef={{
          resizable: true,
          sortable: true,
          filter: true,
          suppressHeaderMenuButton: true,
          suppressHeaderFilterButton: true,
        }}
      />
    </div>
  );
};
