import { ColDef } from "@ag-grid-community/core";
import { format, parseISO } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { StaleEstimate } from "../types/StaleEstimatesData";
import { UpsideEstimateCell } from "../cells/UpsideEstimateCell";
import { DownsideEstimateCell } from "../cells/DownsideEstimateCell";
import { UpsideNoteCell } from "../cells/UpsideNoteCell";
import { DownsideNoteCell } from "../cells/DownsideNoteCell";

export const defaultColDef: ColDef = {
  flex: 1,
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
  resizable: false,
  headerClass: "dockview-table-header",
};

export const createStaleEstimatesColumnDefs = (
  onReaffirmChange?: (id: string, reaffirm: boolean) => void
): ColDef<StaleEstimate>[] => [
  {
    headerName: "Company",
    field: "companyName",
    minWidth: 150,
    headerTooltip: "Company name",
  },
  {
    headerName: "Event Name",
    field: "eventName",
    minWidth: 180,
    headerTooltip: "Name of the event",
  },
  {
    headerName: "Event Description",
    field: "eventDescription",
    minWidth: 250,
    headerTooltip: "Description of the event",
  },
  {
    headerName: "Event Date",
    field: "eventDate",
    minWidth: 120,
    headerTooltip: "Event date",
    sortable: true,
    sort: "asc",
    valueFormatter: (params) => format(parseISO(params.value), "MMM d, yyyy"),
  },
  {
    headerName: "Upside Estimate ($)",
    field: "upsideEstimate",
    minWidth: 150,
    headerTooltip: "Upside estimate (click to edit)",
    cellRenderer: UpsideEstimateCell,
  },
  {
    headerName: "Upside Note",
    field: "upsideNote",
    minWidth: 200,
    headerTooltip: "Upside note (click to edit)",
    cellRenderer: UpsideNoteCell,
  },
  {
    headerName: "Downside Estimate ($)",
    field: "downsideEstimate",
    minWidth: 150,
    headerTooltip: "Downside estimate (click to edit)",
    cellRenderer: DownsideEstimateCell,
  },
  {
    headerName: "Downside Note",
    field: "downsideNote",
    minWidth: 200,
    headerTooltip: "Downside note (click to edit)",
    cellRenderer: DownsideNoteCell,
  },
  {
    headerName: "Last Updated",
    field: "lastUpdated",
    minWidth: 120,
    headerTooltip: "Last updated date",
    valueFormatter: (params) => format(parseISO(params.value), "MMM d, yyyy"),
  },
  {
    headerName: "Reaffirm",
    field: "reaffirm",
    minWidth: 100,
    headerTooltip: "Check to reaffirm this estimate as current",
    cellRenderer: (params: { value: boolean; data: StaleEstimate }) => (
      <div className="flex items-center justify-start h-full">
        <Checkbox
          checked={params.data.reaffirm}
          onCheckedChange={(checked) => {
            if (onReaffirmChange) {
              onReaffirmChange(params.data.id, Boolean(checked));
            }
          }}
        />
      </div>
    ),
  },
];
