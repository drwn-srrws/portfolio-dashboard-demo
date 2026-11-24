import { useCallback } from "react";
import { useStore } from "@/store";
import { Dialogs } from "@store/slices/dialogsSlice";
import { Dialog, DialogContent } from "@components/ui/dialog";
import { CalendarEvent } from "@modules/dashboard/widgets/CoverageCalendar/types/CalendarEvent";
import { EventDialogContent } from "./components/EventDialogContent";

export const EventDialog = () => {
  const { dialogs, updateDialog, prefilled } = useStore();

  const data = prefilled as CalendarEvent | null;

  const eventId = data?.id;

  const onOpenChange = useCallback(() => {
    updateDialog({ dialog: Dialogs.eventDialog, status: false });
  }, [updateDialog]);

  const open = dialogs[Dialogs.eventDialog];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        isClose={false}
        className="flex flex-col h-full gap-0 overflow-y-auto border border-solid border-neutral-700 bg-[var(--neutral-900)] p-0 "
        data-testid="event-dialog-content"
      >
        <EventDialogContent eventId={eventId} onClose={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
};
