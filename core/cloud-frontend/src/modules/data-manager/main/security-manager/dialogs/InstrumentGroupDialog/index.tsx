import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormTextField } from "@/components/Form/FormTextField";
import {
  CreateSecurityCompanyFormData,
  defaultCreateSecurityCompanyValues,
  createSecurityCompanySchema,
} from "./schema";
import { Button } from "@components/ui";
import { useStore } from "@/store";
import { Dialogs } from "@/store/slices/dialogsSlice";
import { Close } from "@radix-ui/react-dialog";
import { Icon } from "@/components/Icon/Icon";
import {
  DialogHeader,
  DialogTitle,
  DialogClose,
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { useConfirm } from "@/providers/ConfirmProvider";
import { useCallback, useEffect } from "react";
import { InstrumentGroupSecurity } from "../../pages/InstrumentGroups/components/InstrumentGroups";
import { useEditSecurityInstrumentGroup } from "./hooks/useEditSecurityInstrumentGroup";
import { useCreateSecurityInstrumentGroup } from "./hooks/useCreateSecurityInstrumentGroup";

import { FormSecuritySelect } from "../../components/FormSecuritySelect";

export interface PrefilledData {
  data?: InstrumentGroupSecurity;
}

export const InstrumentGroupDialog = () => {
  const { updateDialog, prefilled, dialogs } = useStore();
  const { confirm } = useConfirm();

  const prefilledData = prefilled as PrefilledData;
  const isEditMode = !!prefilledData?.data;
  const instrumentGroupId = prefilledData?.data?.id;
  const open = dialogs[Dialogs.instrumentGroupDialog];

  const { createInstrumentGroup } = useCreateSecurityInstrumentGroup();
  const { updateInstrumentGroup } = useEditSecurityInstrumentGroup();

  const {
    control,
    formState: { isDirty },
    handleSubmit: submit,
    reset,
  } = useForm<CreateSecurityCompanyFormData>({
    defaultValues: defaultCreateSecurityCompanyValues,
    resolver: zodResolver(createSecurityCompanySchema),
  });

  const saveChanges = useCallback(
    (values: CreateSecurityCompanyFormData) => {
      if (instrumentGroupId) {
        updateInstrumentGroup(instrumentGroupId, values);
      } else {
        createInstrumentGroup(values);
      }
    },
    [instrumentGroupId, updateInstrumentGroup, createInstrumentGroup]
  );

  const handleSubmit = useCallback(
    (values: CreateSecurityCompanyFormData) => {
      saveChanges(values);
      updateDialog({ dialog: Dialogs.instrumentGroupDialog, status: false });
    },
    [saveChanges, updateDialog]
  );

  const handleClose = useCallback(async () => {
    if (!isDirty)
      return updateDialog({
        dialog: Dialogs.instrumentGroupDialog,
        status: false,
      });

    const isConfirmed = await confirm({
      title: "Unsaved Changes",
      description: "You have unsaved changes. Would you like to save them?",
      confirmButtonText: "Save Changes",
    });

    if (!isConfirmed)
      return updateDialog({
        dialog: Dialogs.instrumentGroupDialog,
        status: false,
      });

    submit(handleSubmit)();
  }, [isDirty, updateDialog, confirm, submit, handleSubmit]);

  useEffect(() => {
    if (open) {
      reset({
        companyName:
          prefilledData?.data?.name ??
          defaultCreateSecurityCompanyValues.companyName,
        addSecurities:
          prefilledData?.data?.instruments ??
          defaultCreateSecurityCompanyValues.addSecurities,
      });
    }
  }, [open, prefilledData, reset]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        isClose={false}
        className="flex flex-col h-full gap-0 border border-solid border-neutral-700 bg-[var(--neutral-900)] p-0 "
      >
        <div className="h-full flex flex-col">
          <div className="flex flex-col gap-4 p-4 flex-1 min-h-0">
            <DialogHeader>
              <div className="flex items-center justify-between pb-3">
                <DialogTitle>
                  {isEditMode
                    ? "Edit Instrument Group"
                    : "Create Instrument Group"}
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
            </DialogHeader>

            <div className="flex flex-col gap-4 flex-1 min-h-0">
              <FormTextField
                required
                name="companyName"
                control={control}
                label="Instrument Group Name"
                placeholder="Instrument Group Name"
                testId="edit-security-security-name-input"
                defaultValue={prefilledData?.data?.name || ""}
              />
              <FormSecuritySelect
                disableFiltering
                withNoInstrumentGroup
                name="addSecurities"
                control={control}
                label="Add Securities"
                testId="edit-security-security-select"
                placeholder="Select Securities"
                prefilledSecurities={prefilledData?.data?.instruments}
              />
            </div>
          </div>

          <AlertDialogFooter className="p-4 sm:justify-between">
            <DialogClose asChild>
              <Button variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="secondary"
              onClick={submit(handleSubmit)}
              data-testid="instrument-group-dialog-save-button"
            >
              {isEditMode ? "Save Changes" : "Create"}
            </Button>
          </AlertDialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
