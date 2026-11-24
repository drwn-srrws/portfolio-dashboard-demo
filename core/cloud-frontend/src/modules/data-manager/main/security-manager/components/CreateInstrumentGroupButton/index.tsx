import { useCallback } from "react";
import { Icon } from "@/components/Icon/Icon";
import { Button } from "@/components/ui";
import { useStore } from "@/store";
import { Dialogs } from "@/store/slices/dialogsSlice";

export const CreateInstrumentGroupButton = () => {
  const { updateDialog } = useStore();

  const handleCreateInstrumentGroup = useCallback(() => {
    updateDialog({ dialog: Dialogs.instrumentGroupDialog, status: true });
  }, [updateDialog]);

  return (
    <Button
      variant="ghost"
      onClick={handleCreateInstrumentGroup}
      data-testid="create-instrument-group-button"
    >
      <span className="flex gap-2 items-center text-[0.875rem]">
        <Icon name="CirclePlus" color="currentColor" size="md" />
        <span>Create New Instrument Group</span>
      </span>
    </Button>
  );
};
