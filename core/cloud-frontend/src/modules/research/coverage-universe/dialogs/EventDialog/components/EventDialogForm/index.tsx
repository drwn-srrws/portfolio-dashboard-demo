import { useCallback, useEffect } from "react";
import { AxiosError } from "axios";
import { DeepPartial, FormProvider } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { Close } from "@radix-ui/react-dialog";
import { HTTPError } from "@api/types";
import {
  getReadEventQueryKey,
  getReadEventsQueryKey,
  useCreateEvent,
  usePatchEvent,
} from "@api/endpoints/event/event";
import { Button, DialogClose, DialogHeader, DialogTitle } from "@components/ui";
import { Icon } from "@components/Icon/Icon";
import { AlertDialogFooter } from "@components/ui/alert-dialog";
import { toast } from "@components/ui/use-toast";
import { EventFormFields } from "../EventFormFields";
import { useEventForm } from "../../hooks/useEventForm";
import { EventFormData } from "../../schema/eventSchema";
import { mapFormDataToDto } from "../../helpers/mapFormDataToDto";
import { getEventsQueryKey } from "@/modules/dashboard/widgets/CoverageCalendar/hooks/useGetEvents";

export interface EventFormProps {
  eventId?: string;
  defaultValues?: DeepPartial<EventFormData>;
  onClose?: () => void;
}

export const EventForm = ({
  eventId,
  defaultValues,
  onClose,
}: EventFormProps) => {
  const queryClient = useQueryClient();

  const { mutateAsync: createEvent } = useCreateEvent({
    mutation: {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: getReadEventsQueryKey(),
        });

        queryClient.invalidateQueries({
          queryKey: getEventsQueryKey(),
        });
      },
    },
  });

  const { mutateAsync: updateEvent } = usePatchEvent({
    mutation: {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: getReadEventsQueryKey(),
        });

        queryClient.invalidateQueries({
          queryKey: getReadEventQueryKey(+eventId!),
        });

        queryClient.invalidateQueries({
          queryKey: getEventsQueryKey(),
        });
      },
    },
  });

  const form = useEventForm({ defaultValues });

  const { handleSubmit, reset } = form;

  const isEditMode = !!defaultValues;

  const handleCreateEvent = useCallback(
    async (data: EventFormData) => {
      try {
        const dto = mapFormDataToDto(data);

        await createEvent({ data: dto });

        toast({
          title: "Event created successfully",
        });

        onClose?.();
      } catch (error) {
        const axiosError = error as AxiosError<HTTPError>;
        toast({
          title: "Error creating event",
          description: axiosError.response?.data.detail ?? "Please try again",
          variant: "destructive",
        });
      }
    },
    [createEvent, onClose]
  );

  const handleUpdateEvent = useCallback(
    async (data: EventFormData) => {
      try {
        const dto = mapFormDataToDto(data);

        await updateEvent({ id: +eventId!, data: dto });

        toast({
          title: "Event updated successfully",
        });

        onClose?.();
      } catch (error) {
        const axiosError = error as AxiosError<HTTPError>;
        toast({
          title: "Error updating event",
          description: axiosError.response?.data.detail ?? "Please try again",
          variant: "destructive",
        });
      }
    },
    [eventId, onClose, updateEvent]
  );

  const handleSaveEvent = useCallback(
    async (data: EventFormData) => {
      if (isEditMode) {
        handleUpdateEvent(data);
      } else {
        handleCreateEvent(data);
      }
    },
    [handleCreateEvent, handleUpdateEvent, isEditMode]
  );

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <FormProvider {...form}>
      <div className="h-full">
        <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
          <DialogHeader>
            <div className="flex items-center justify-between pb-3">
              <DialogTitle>
                {isEditMode ? "Edit Event" : "Create Event"}
              </DialogTitle>
              <Close className="w-fit">
                <div className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-neutral-700 transition-colors hover:bg-neutral-800">
                  <Icon name="X" color="currentColor" size="lg" />
                </div>
              </Close>
            </div>
          </DialogHeader>

          <EventFormFields />

          <AlertDialogFooter className="mt-auto sm:justify-between">
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
              </DialogClose>
            </div>

            <Button
              variant="secondary"
              data-testid={
                isEditMode ? "update-event-button" : "create-event-button"
              }
              onClick={handleSubmit(handleSaveEvent)}
            >
              {isEditMode ? "Update" : "Create"}
            </Button>
          </AlertDialogFooter>
        </div>
      </div>
    </FormProvider>
  );
};
