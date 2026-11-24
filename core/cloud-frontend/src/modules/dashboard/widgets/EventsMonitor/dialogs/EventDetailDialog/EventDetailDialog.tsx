import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Dialogs } from "@/store/slices/dialogsSlice";
import { Close } from "@radix-ui/react-dialog";
import { Icon } from "@/components/Icon/Icon";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { useStore } from "@/store";

import { AxiosError } from "axios";
import { FormProvider, useForm } from "react-hook-form";
import { FormEventHorizon } from "@/components/Form/FormEventHorizon";
import { zodResolver } from "@hookform/resolvers/zod";
import { HTTPError } from "@api/types";
import { resolveEventHorizon } from "@/utils/eventHorizon";
import { useMemo } from "react";
import {
  defaultEventDetailDialogValues,
  eventDetailDialogSchema,
  IEventDetailDialogValues,
} from "./eventDetailDialogSchema";
import { FormTextArea } from "@/components/Form/FormTextArea";
import { FormTextSelect } from "@/components/Form/FormTextSelect";
import { FormCheckbox } from "@/components/Form/FormCheckbox";
import { useEventMutations } from "../../hooks/useEventMutations";
import { FormTextField } from "@/components/Form/FormTextField";
import { PrefilledEventData } from "../../cells/EventCell";
import { toast } from "@/components/ui/use-toast";
import { useEventOptions } from "../../hooks/useEventOptions";
import { useChangeHistory } from "../../../../providers/ChangeHistoryProvider";

export const EventDetailDialog = () => {
  const { updateDialog, prefilled: dialogPrefilled, dialogs } = useStore();
  const { addHistoryEntry } = useChangeHistory();
  const isOpen = dialogs[Dialogs.openEventDetailDialog];
  const prefilled = dialogPrefilled as PrefilledEventData | null;
  const prefilledId = prefilled?.id;
  const prefilledData = isOpen && prefilled ? prefilled : null;

  const initialValues = useMemo(
    () => prefilledData || defaultEventDetailDialogValues,
    [prefilledData]
  );

  const form = useForm<IEventDetailDialogValues>({
    values: initialValues as IEventDetailDialogValues,
    resolver: zodResolver(eventDetailDialogSchema),
  });

  const { control, handleSubmit } = form;

  const {
    eventAnticipatedImpactsOptions,
    eventTypesOptions,
    isEventOptionsLoading,
  } = useEventOptions();

  const {
    patchEvent,
    createEvent,
    deleteEvent,
    isLoading: isMutationLoading,
  } = useEventMutations();

  const handleClose = useMemo(
    () => () => {
      updateDialog({ dialog: Dialogs.openEventDetailDialog, status: false });
    },
    [updateDialog]
  );
  const onSubmit = async (formData: IEventDetailDialogValues) => {
    const patchData = {
      name: String(formData.name),
      ...resolveEventHorizon({
        shape: formData.dateShape,
        date: formData.date,
        rangeWeeks: formData.rangeWeeks,
      }),
      description: formData.description,
      workstream_description: formData.workstreamDescription,
      is_passed: formData.hasPassed,
      event_type_id: formData.eventType,
      anticipated_impact_id: formData.eventClassification,
      actual_impact_id: formData.eventImpact,
    };
    try {
      if (!prefilledId && prefilledData?.companyId) {
        await createEvent({
          data: {
            ...patchData,
            company_id: Number(prefilledData?.companyId),
            event_type_id: Number(formData.eventType),
          },
        });
        addHistoryEntry({
          type: "create",
          entity: "event",
          title: "Event Created",
          description: `${prefilledData?.companyName} - ${formData.name}`,
          data: { companyId: prefilledData?.companyId },
        });
        toast({ title: "Event created successfully" });
      } else {
        if (!prefilledId) return;
        await patchEvent({ id: prefilledId, data: patchData });
        addHistoryEntry({
          type: "update",
          entity: "event",
          title: "Event Updated",
          description: `${prefilledData?.companyName} - ${formData.name}`,
          data: { eventId: prefilledId },
        });
        toast({ title: "Event updated successfully" });
      }
      handleClose();
    } catch (error) {
      const axiosError = error as AxiosError<HTTPError>;
      toast({
        title: prefilledId
          ? "Failed to update event"
          : "Failed to create event",
        description: axiosError.response?.data.detail ?? "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!prefilledId) return;
    try {
      await deleteEvent({ id: prefilledId });
      addHistoryEntry({
        type: "delete",
        entity: "event",
        title: "Event Deleted",
        description: `${prefilledData?.companyName || "Unknown Company"} - ${prefilledData?.name || "Unknown Event"}`,
      });
      toast({ title: "Event deleted successfully" });
    } catch {
      toast({ title: "Failed to delete event", variant: "destructive" });
    }
    handleClose();
  };

  const isLoading = isEventOptionsLoading || isMutationLoading;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        isClose={false}
        className="flex flex-col gap-0 border border-solid border-neutral-700 bg-[var(--neutral-900)] p-0 max-h-[90vh]"
      >
        <div className="flex flex-col">
          <div
            className="flex flex-col gap-4 p-4"
            data-testid="coverage-dialog"
          >
            <DialogHeader>
              <div className="flex items-center justify-between pb-3">
                <DialogTitle>
                  {prefilledId ? "Edit Event" : "Create New Event"}
                </DialogTitle>
                <Close className="w-fit">
                  <div
                    className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-neutral-700 transition-colors hover:bg-neutral-800"
                    onClick={handleClose}
                  >
                    <Icon name="X" color="currentColor" size="lg" />
                  </div>
                </Close>
              </div>
              <DialogDescription className="break-words">
                {prefilledId
                  ? "Update event details for this company."
                  : "Add a new event for this company."}
              </DialogDescription>
            </DialogHeader>

            <FormProvider {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormTextField
                  placeholder="Company"
                  name="companyName"
                  label="Company Name"
                  control={control}
                  disabled
                  required
                />
                <FormTextField
                  placeholder="Name"
                  name="name"
                  label="Name"
                  control={control}
                  required
                />
                <FormTextSelect
                  placeholder="Event Type"
                  name="eventType"
                  label="Event Type Name"
                  options={eventTypesOptions}
                  control={control}
                  required
                />
                <FormTextSelect
                  placeholder="Event Classification"
                  name="eventClassification"
                  label="Event Classification"
                  options={eventAnticipatedImpactsOptions}
                  control={control}
                  required
                />
                <FormEventHorizon
                  required
                  control={control}
                  shapeName="dateShape"
                  dateName="date"
                  rangeWeeksName="rangeWeeks"
                />
                <FormTextArea
                  placeholder="Description"
                  name="description"
                  label="Description"
                  control={control}
                />
                <FormCheckbox
                  name="hasPassed"
                  label="Has passed"
                  control={control}
                />

                <AlertDialogFooter className="flex flex-col-reverse gap-2 p-4 sm:flex-row sm:justify-between">
                  <DialogClose asChild>
                    <Button
                      variant="ghost"
                      onClick={handleClose}
                      disabled={isLoading}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                    {prefilledId && (
                      <Button
                        variant="destructive"
                        disabled={isLoading}
                        onClick={handleDelete}
                        data-testid="coverage-dialog-delete-button"
                        className="w-full sm:w-auto"
                      >
                        {isMutationLoading ? "Deleting..." : "Delete"}
                      </Button>
                    )}
                    <Button
                      type="submit"
                      variant="secondary"
                      disabled={isLoading}
                      data-testid="coverage-dialog-save-button"
                      className="w-full sm:w-auto"
                    >
                      {isLoading
                        ? "Saving..."
                        : prefilledId
                          ? "Update"
                          : "Create"}
                    </Button>
                  </div>
                </AlertDialogFooter>
              </form>
            </FormProvider>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
