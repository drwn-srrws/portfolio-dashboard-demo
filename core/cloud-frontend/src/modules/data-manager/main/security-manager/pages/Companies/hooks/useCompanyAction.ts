import { CompanySecurity } from "../components/Companies";

import { toast } from "@/components/ui/use-toast";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useConfirm } from "@/providers/ConfirmProvider";
import { useStore } from "@/store";
import { Dialogs } from "@/store/slices/dialogsSlice";
import { useDeleteCompanyV2 } from "@/api/endpoints/company/company";
import { getListCompaniesV2CustomQueryKey } from "@/hooks/api/useListCompaniesV2";

export const useCompanyAction = () => {
  const queryClient = useQueryClient();
  const { confirm } = useConfirm();
  const { updateDialog } = useStore();

  const { mutateAsync: deleteCompany, isPending: isDeletingCompany } =
    useDeleteCompanyV2({
      mutation: {
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: getListCompaniesV2CustomQueryKey(),
          });
        },
      },
    });

  const handleEditCompany = useCallback(
    (data?: CompanySecurity) => () => {
      updateDialog({
        dialog: Dialogs.companyDialog,
        status: true,
        prefilled: { data: data },
      });
    },
    [updateDialog]
  );

  const handleDeleteCompany = useCallback(
    (data?: CompanySecurity) => async () => {
      if (!data) return;

      const isConfirmed = await confirm({
        title: "Delete company",
        description: "Are you sure you want to delete this company",
        confirmButtonText: "Delete",
      });

      if (!isConfirmed) return;

      try {
        await deleteCompany({ companyId: Number(data.id) });
        toast({ title: "Company was deleted successfully" });
      } catch {
        toast({ title: "Error deleting company", variant: "destructive" });
      }
    },
    [confirm, deleteCompany]
  );

  return { handleEditCompany, handleDeleteCompany, isDeletingCompany };
};
