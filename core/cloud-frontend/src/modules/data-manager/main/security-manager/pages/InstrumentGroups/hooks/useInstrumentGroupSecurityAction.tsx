import { toast } from "@/components/ui/use-toast";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useConfirm } from "@/providers/ConfirmProvider";
import { useStore } from "@/store";
import {
  useDeleteInstrumentGroup,
  getGetInstrumentGroupsQueryKey,
  getGetInstrumentGroupQueryKey,
} from "@/api/endpoints/instrument-group/instrument-group";
import { Dialogs } from "@/store/slices/dialogsSlice";
import { InstrumentGroupSecurity } from "../components/InstrumentGroups";

export const useInstrumentGroupSecurityAction = (
  data: InstrumentGroupSecurity
) => {
  const queryClient = useQueryClient();
  const { confirm } = useConfirm();
  const { updateDialog } = useStore();

  const { mutateAsync: deleteSecurity, isPending: isDeletingSecurity } =
    useDeleteInstrumentGroup({
      mutation: {
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: getGetInstrumentGroupsQueryKey(),
          });

          queryClient.invalidateQueries({
            queryKey: getGetInstrumentGroupQueryKey(data.id),
          });
        },
      },
    });

  const handleEditSecurity = useCallback(
    (data?: InstrumentGroupSecurity) => () => {
      updateDialog({
        dialog: Dialogs.instrumentGroupDialog,
        status: true,
        prefilled: { data: data },
      });
    },
    [updateDialog]
  );

  const handleDeleteSecurity = useCallback(
    (data?: InstrumentGroupSecurity) => async () => {
      if (!data) return;

      const isConfirmed = await confirm({
        title: "Delete instrument group",
        description: "Are you sure you want to delete this instrument group",
        confirmButtonText: "Delete",
      });

      if (!isConfirmed) return;

      try {
        await deleteSecurity({ groupId: data.id });
        toast({ title: "Instrument Group was deleted successfully" });
      } catch {
        toast({
          title: "Error deleting instrument group",
          variant: "destructive",
        });
      }
    },
    [confirm, deleteSecurity]
  );

  return {
    handleEditSecurity,
    handleDeleteSecurity,
    isDeletingSecurity,
  };
};
