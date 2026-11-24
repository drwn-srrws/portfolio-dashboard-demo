import { ColDef } from "@ag-grid-community/core";
import { Checkbox } from "@/components/ui/checkbox";
import { PassedEvent } from "../types/PassedEventsData";
import { DateEditCell } from "../cells/DateEditCell";

export const defaultColDef: ColDef = {
  flex: 1,
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
  resizable: false,
  headerClass: "dockview-table-header",
};

export const createPassedEventsColumnDefs = (
  onDateChange?: (eventId: number, newDate: string) => void,
  onHasPassedChange?: (eventId: number, hasPassed: boolean) => void
): ColDef<PassedEvent>[] => [
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
    minWidth: 150,
    headerTooltip: "Event date (click to edit)",
    sortable: true,
    sort: "asc",
    cellRenderer: DateEditCell,
    cellRendererParams: {
      onDateChange,
    },
  },
  {
    headerName: "Has Passed",
    field: "hasPassed",
    minWidth: 120,
    headerTooltip: "Check if the event has passed",
    cellRenderer: (params: { value: boolean; data: PassedEvent }) => (
      <div className="flex items-center justify-start h-full">
        <Checkbox
          checked={params.data.hasPassed}
          onCheckedChange={(checked) => {
            if (onHasPassedChange) {
              onHasPassedChange(params.data.eventId, Boolean(checked));
            }
          }}
        />
      </div>
    ),
  },
];
