import { useStore } from "@/store";
import { Dialogs } from "@/store/slices/dialogsSlice";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCallback } from "react";

import Stepper from "./components/Stepper";
import { StepProvider } from "@/providers/StepProvider";

export const SecurityDialog = () => {
  const { dialogs, updateDialog } = useStore();

  const onOpenChange = useCallback(() => {
    updateDialog({ dialog: Dialogs.editSecurityDialog, status: false });
  }, [updateDialog]);

  const open = dialogs[Dialogs.editSecurityDialog];

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <StepProvider>
        <DialogContent
          isClose={false}
          className="flex flex-col gap-0 overflow-y-auto border border-solid border-neutral-700 bg-[var(--neutral-900)] p-0 w-auto max-w-[unset] h-[unset] max-h-[90vh]"
        >
          <Stepper onOpenChange={onOpenChange} />
        </DialogContent>
      </StepProvider>
    </Dialog>
  );
};
