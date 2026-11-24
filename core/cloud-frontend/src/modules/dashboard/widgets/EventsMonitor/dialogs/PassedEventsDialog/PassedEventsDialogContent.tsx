import { useStore } from "@store/index";
import { useState, useCallback, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { DataGrid } from "@components/Datagrid/index";
import { useSavePassedEvents } from "./hooks/useSavePassedEvents";
import { Dialogs } from "@store/slices/dialogsSlice";
import { PassedEvent } from "./types/PassedEventsData";
import { createPassedEventsColumnDefs } from "./constants/columnDefs";
import { defaultColDef } from "./constants/columnDefs";
import { Button } from "@/components/ui";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui";

const getRowId = (data: PassedEvent) => String(data.eventId);

export const PassedEventsDialogContent = ({
  passedEvents,
  isLoading,
}: {
  passedEvents: PassedEvent[];
  isLoading: boolean;
}) => {
  const { updateDialog } = useStore();
  const { saveEvents, isSaving } = useSavePassedEvents();
  const [localEvents, setLocalEvents] = useState<PassedEvent[]>(passedEvents);

  const handleClose = useCallback(() => {
    updateDialog({
      dialog: Dialogs.openPassedEventsDialog,
      status: false,
    });
  }, [updateDialog]);

  const updateEvent = useCallback(
    (eventId: number, updates: Partial<PassedEvent>) => {
      setLocalEvents((prev) =>
        prev.map((event) => {
          return event.eventId === eventId ? { ...event, ...updates } : event;
        })
      );
    },
    []
  );

  const handleDateChange = useCallback(
    (eventId: number, newDate: string) => {
      updateEvent(eventId, { eventDate: newDate });
    },
    [updateEvent]
  );

  const handleHasPassedChange = useCallback(
    (eventId: number, hasPassed: boolean) => {
      updateEvent(eventId, { hasPassed });
    },
    [updateEvent]
  );

  const handleSave = () => {
    saveEvents(localEvents, passedEvents, handleClose);
  };

  const handleRemindLater = () => {
    handleClose();
  };

  const columnDefs = useMemo(
    () => createPassedEventsColumnDefs(handleDateChange, handleHasPassedChange),
    [handleDateChange, handleHasPassedChange]
  );

  return (
    <DialogContent
      isClose={false}
      className="flex flex-col h-full gap-0 border border-solid border-neutral-700 bg-[var(--neutral-900)] p-0 max-w-[80%] sm:max-w-[80%] w-full"
    >
      <div className="border-b border-neutral-700">
        <div className="p-4">
          <DialogHeader>
            <div className="flex items-center justify-between pb-3">
              <DialogTitle className="w-fit text-xl font-semibold text-white">
                Update Event Dates
              </DialogTitle>
            </div>
          </DialogHeader>
          <p className="text-sm text-neutral-400">
            Some of your events have event dates in the past but haven’t been
            explicitly marked as passed. Use the table below to modify the event
            dates or mark them as passed
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ minHeight: "400px" }}
          >
            <Loader2 className="animate-spin" size="48" color="white" />
          </div>
        ) : (
          <DataGrid
            rowData={localEvents}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            getRowId={getRowId}
            loading={isLoading}
            pending={false}
            suppressCellFocus={true}
          />
        )}
      </div>

      <div className="flex justify-end gap-3 px-4 py-4 border-t border-neutral-700">
        <Button
          variant="ghost"
          onClick={handleRemindLater}
          className="text-neutral-300 hover:text-white hover:bg-neutral-700"
        >
          Remind me next time
        </Button>
        <Button
          onClick={handleSave}
          variant="default"
          disabled={isLoading || isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </DialogContent>
  );
};
