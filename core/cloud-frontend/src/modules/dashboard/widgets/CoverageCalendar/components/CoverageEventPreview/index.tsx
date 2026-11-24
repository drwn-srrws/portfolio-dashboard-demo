import { Chip } from "@/components/Chip";
import { Icon } from "@/components/Icon/Icon";
import { Button } from "@/components/ui";
import { CalendarEvent } from "../../types/CalendarEvent";
import { useStore } from "@/store";
import { useConfirm } from "@/providers/ConfirmProvider";
import { useCallback } from "react";
import { useReadEvent } from "@/api/endpoints/event/event";
import { toast } from "@/components/ui/use-toast";
import { Dialogs } from "@/store/slices/dialogsSlice";
import { EventType } from "../../types/EventType";
import { Skeleton } from "@/components/ui/skeleton";
import { hyphenatedDate } from "@/utils";

const typeColors: Record<EventType, string> = {
  commercials: "#E65A1E",
  regulatory: "#CD42E6",
  clinicalTrail: "#3787FF",
};

const typeTitles: Record<EventType, string> = {
  commercials: "Commercials",
  regulatory: "Regulatory",
  clinicalTrail: "Clinical Trail",
};

export interface CoverageEventPreviewProps {
  event: CalendarEvent;
  onClose: () => void;
}

export const CoverageEventPreview = ({
  event: { id: eventId, name, start },
  onClose,
}: CoverageEventPreviewProps) => {
  const { updateDialog } = useStore();
  const { confirm } = useConfirm();

  const { data: event, isLoading } = useReadEvent(+eventId);

  const handleEditEvent = useCallback(() => {
    updateDialog({
      dialog: Dialogs.eventDialog,
      status: true,
      prefilled: event,
    });
  }, [event, updateDialog]);

  const handleDeleteEvent = useCallback(async () => {
    try {
      const confirmed = await confirm({
        title: "Delete",
        description:
          "Are you sure you want to delete this event? This action cannot be undone.",
        confirmButtonText: "Delete",
      });

      if (!confirmed) return;

      toast({
        title: "Event deleted",
        description: "The event has been deleted successfully",
      });
    } catch {
      toast({
        title: "Error deleting event",
        description: "Please try again",
      });
    }
  }, [confirm]);

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-3 gap-2 w-[446px] ">
      <div className="flex gap-2 justify-end ">
        <Button
          variant={"outline"}
          className="w-10 p-0"
          onClick={handleEditEvent}
        >
          <Icon name="Pencil" color="white" size="lg" />
        </Button>
        <Button
          variant={"outline"}
          className="w-10 p-0"
          onClick={handleDeleteEvent}
        >
          <Icon name="Trash" color="white" size="lg" />
        </Button>
        <Button variant={"outline"} className="w-10 p-0" onClick={onClose}>
          <Icon name="X" color="white" size="lg" />
        </Button>
      </div>
      <div className="flex flex-col gap-2 text-neutral-400 text-base">
        <div className="flex flex-col">
          <p>Name</p>
          <p className="text-neutral-100 text-lg">{name}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <p>Type*</p>
            <Chip
              name={typeTitles["commercials"]}
              color={typeColors["commercials"]}
              className="text-neutral-100 text-base"
            />
          </div>
          <div className="flex flex-col">
            <p>Classification*</p>
            {!isLoading ? (
              <p className="text-neutral-100 text-base">
                {event?.workstream_description}
              </p>
            ) : (
              <Skeleton className="w-full h-5" />
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <p>Company*</p>
          {!isLoading ? (
            <p className="text-neutral-100 text-base">
              {event?.company_display_name}
            </p>
          ) : (
            <Skeleton className="w-full h-5" />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <p>Date*</p>
            <p className="text-neutral-100 text-base">
              {hyphenatedDate(start)}
            </p>
          </div>
          <div className="flex flex-col">
            <p>Cover Position from (Optional)*</p>
            <p className="text-neutral-100 text-base">None</p>
          </div>
        </div>

        <div className="flex flex-col">
          <p>Description (optional)</p>
          {!isLoading ? (
            <p className="text-neutral-100 text-base">{event?.description}</p>
          ) : (
            <Skeleton className="w-full h-5" />
          )}
        </div>
      </div>
    </div>
  );
};
