import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { useUpdateInstrument } from "@/api/endpoints/instrument/instrument";
import {
  getGetInstrumentsQueryKey,
  getGetInstrumentQueryKey,
} from "@/api/endpoints/instrument/instrument";
import { EditIssuerFormDataType } from "../editIssuerSchema";

export const useEditIssuer = ({
  instrumentId,
  data,
  callback,
}: {
  instrumentId: number;
  callback?: (() => void)[];
  data: EditIssuerFormDataType;
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateInstrument, isPending: isUpdating } =
    useUpdateInstrument({
      mutation: {
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: getGetInstrumentsQueryKey(),
          });
          queryClient.invalidateQueries({
            queryKey: getGetInstrumentQueryKey(instrumentId),
          });
        },
      },
    });

  const handleUpdate = async (values: EditIssuerFormDataType) => {
    if (!instrumentId) return;

    if (values.company?.value === data.company?.value) {
      if (callback?.length) callback.forEach((cb) => cb());
      return;
    }

    try {
      await updateInstrument({
        id: instrumentId,
        data: {
          issuer_id: values.company?.value
            ? Number(values.company.value)
            : null,
        },
      });

      queryClient.invalidateQueries({ queryKey: getGetInstrumentsQueryKey() });
      queryClient.invalidateQueries({
        queryKey: getGetInstrumentQueryKey(instrumentId),
      });
      if (callback?.length) callback.forEach((cb) => cb());
      toast({ title: "Issuer updated successfully", variant: "primary" });
    } catch (error) {
      console.error("Error updating issuer", error);
      toast({ title: "Failed to update issuer", variant: "destructive" });
    }
  };

  return {
    handleUpdate,
    isUpdating,
  };
};
