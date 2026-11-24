import { usePatchEvent } from "@api/endpoints/event/event";
import { toast } from "@/components/ui/use-toast";
import { hyphenatedDate } from "@/utils/dates";
import { PassedEvent } from "../types/PassedEventsData";
import { useChangeHistory } from "../../../../../providers/ChangeHistoryProvider";

export const useSavePassedEvents = () => {
  const { mutateAsync: editEvent, isPending: isSaving } = usePatchEvent();
  const { addHistoryEntry } = useChangeHistory();

  const saveEvents = async (
    localEvents: PassedEvent[],
    originalEvents: PassedEvent[],
    onSuccess?: () => void
  ) => {
    const changedEvents = localEvents.filter((local) =>
      originalEvents.some(
        (orig) =>
          orig.eventId === local.eventId &&
          (orig.eventDate !== local.eventDate ||
            orig.hasPassed !== local.hasPassed)
      )
    );

    if (!changedEvents.length) {
      onSuccess?.();
      return;
    }

    try {
      await Promise.all(
        changedEvents.map((event) =>
          editEvent({
            data: {
              date: hyphenatedDate(new Date(event.eventDate)),
              is_passed: event.hasPassed,
            },
            id: event.eventId,
          })
        )
      );

      toast({ title: "Event was saved!" });

      changedEvents.forEach((event) => {
        addHistoryEntry({
          type: "update",
          entity: "batch_events",
          title: "Event Date/Status Updated",
          description: `${event.companyName} - ${event.eventName}`,
          data: { eventId: event.eventId },
        });
      });

      onSuccess?.();
    } catch (e: unknown) {
      toast({ title: (e as Error).message, variant: "destructive" });
    }
  };

  return { saveEvents, isSaving };
};
