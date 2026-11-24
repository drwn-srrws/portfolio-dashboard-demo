import { useMemo } from "react";
import { DeepPartial } from "react-hook-form";
import { useReadEvent } from "@api/endpoints/event/event";
import { Loader } from "@components/Loader";
import { EventForm } from "../EventDialogForm";
import { EventFormData } from "../../schema/eventSchema";
import { parseDateString } from "@/utils";

export interface EventDialogContentProps {
  eventId?: string;
  onClose?: () => void;
}

export const EventDialogContent = ({
  eventId,
  onClose,
}: EventDialogContentProps) => {
  const { data: event, isLoading } = useReadEvent(+eventId!, {
    query: { enabled: !!eventId },
  });

  const defaultValues = useMemo(() => {
    if (!event) return undefined;

    return {
      name: event.name,
      type: event.event_type_id ? `${event.event_type_id}` : null,
      classification: event.anticipated_impact_id
        ? `${event.anticipated_impact_id}`
        : null,
      company: event.company_id ? `${event.company_id}` : null,
      date: event.date ? parseDateString(event.date) : new Date(),
      impact: event.actual_impact_id ? `${event.actual_impact_id}` : null,
      description: event.description ?? "",
      workstreamDescription: event.workstream_description ?? "",
    } as DeepPartial<EventFormData>;
  }, [event]);

  if (isLoading) return <Loader />;

  return (
    <EventForm
      eventId={eventId}
      defaultValues={defaultValues}
      onClose={onClose}
    />
  );
};
