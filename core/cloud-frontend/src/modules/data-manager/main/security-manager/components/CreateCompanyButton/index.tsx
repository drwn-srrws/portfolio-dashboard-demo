import { useCallback } from "react";
import { Icon } from "@/components/Icon/Icon";
import { Button } from "@/components/ui";
import { useStore } from "@/store";
import { Dialogs } from "@/store/slices/dialogsSlice";

export const CreateCompanyButton = () => {
  const { updateDialog } = useStore();

  const handleCreateCompany = useCallback(() => {
    updateDialog({ dialog: Dialogs.companyDialog, status: true });
  }, [updateDialog]);

  return (
    <Button
      variant="ghost"
      onClick={handleCreateCompany}
      data-testid="create-company-button"
    >
      <span className="flex gap-2 items-center text-[0.875rem]">
        <Icon name="CirclePlus" color="currentColor" size="md" />
        <span>Create New Company</span>
      </span>
    </Button>
  );
};
