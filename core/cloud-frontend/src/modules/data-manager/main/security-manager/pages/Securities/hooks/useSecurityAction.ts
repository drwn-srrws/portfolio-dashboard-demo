import { toast } from "@/components/ui/use-toast";
import { useCallback } from "react";
import { InstrumentResponse as Instrument } from "@/api/types";
import { useQueryClient } from "@tanstack/react-query";
import { useConfirm } from "@/providers/ConfirmProvider";
import { useStore } from "@/store";
import {
  getGetInstrumentQueryKey,
  getGetInstrumentsQueryKey,
  useDeleteInstrument,
  usePublishInstrument,
} from "@/api/endpoints/instrument/instrument";
import { Dialogs } from "@/store/slices/dialogsSlice";

export const useSecurityActions = (data: Instrument) => {
  const queryClient = useQueryClient();
  const { confirm } = useConfirm();
  const { updateDialog } = useStore();

  const { mutateAsync: deleteSecurity, isPending: isDeletingSecurity } =
    useDeleteInstrument({
      mutation: {
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: getGetInstrumentsQueryKey(),
          });

          queryClient.invalidateQueries({
            queryKey: getGetInstrumentQueryKey(data.id),
          });
        },
      },
    });

  const { mutateAsync: publishSecurity, isPending: isPublishingSecurity } =
    usePublishInstrument({
      mutation: {
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: getGetInstrumentsQueryKey(),
          });

          queryClient.invalidateQueries({
            queryKey: getGetInstrumentQueryKey(data.id),
          });
        },
      },
    });

  const handleEditSecurity = useCallback(
    (data?: Instrument) => () => {
      updateDialog({
        dialog: Dialogs.editSecurityDialog,
        status: true,
        prefilled: {
          data: data,
        },
      });
    },
    [updateDialog]
  );

  const handleDeleteSecurity = useCallback(
    (data?: Instrument) => async () => {
      if (!data) return;

      const isConfirmed = await confirm({
        title: "Delete security",
        description: "Are you sure you want to delete this security",
        confirmButtonText: "Delete",
      });

      if (!isConfirmed) return;

      try {
        await deleteSecurity({ id: data.id });
        toast({ title: "Security was deleted successfully" });
      } catch {
        toast({
          title: "Error deleting security",
          variant: "destructive",
        });
      }
    },
    [confirm, deleteSecurity]
  );

  const handlePublishSecurity = useCallback(
    (data?: Instrument) => async () => {
      if (!data) return;

      try {
        await publishSecurity({
          id: data.id,
          params: { publish_externally: true },
        });
        toast({ title: "Security was published successfully" });
      } catch {
        toast({
          title: "Error publishing security",
          variant: "destructive",
        });
      }
    },
    [publishSecurity]
  );

  return {
    handleEditSecurity,
    handleDeleteSecurity,
    handlePublishSecurity,
    isDeletingSecurity,
    isPublishingSecurity,
  };
};
