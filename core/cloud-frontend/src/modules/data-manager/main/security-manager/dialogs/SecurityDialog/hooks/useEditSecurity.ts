import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { useUpdateInstrument } from "@/api/endpoints/instrument/instrument";
import {
  getGetInstrumentsQueryKey,
  getGetInstrumentQueryKey,
} from "@/api/endpoints/instrument/instrument";
import { EditSecurityFormData } from "../editSecuritySchema";
import { AssetClass } from "@/api/types";
import { Selectable } from "@/typings/Selectable";

import {
  formatMultiSelectFields,
  formatTextFieldValues,
  formatSingleSelectFields,
  formatAuditFieldValues,
} from "../../../helpers/formatFieldValues";

export const useEditSecurity = ({
  instrumentId,
  callback,
}: {
  instrumentId: number;
  callback?: (() => void)[];
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
          if (callback?.length) callback.forEach((cb) => cb());
        },
      },
    });

  const handleUpdate = async (
    values: EditSecurityFormData & {
      [key: string]: string | Selectable | Selectable[] | null;
    }
  ) => {
    if (!instrumentId) return;

    try {
      const singleSelectsData = formatSingleSelectFields(values);
      const multiSelectsData = formatMultiSelectFields(values);
      const textFieldsData = formatTextFieldValues(values);
      const auditData = formatAuditFieldValues(values);

      const mergedData = {
        ...singleSelectsData,
        ...multiSelectsData,
        ...textFieldsData,
        ...auditData,
        asset_class: values.asset_class.value as AssetClass,
      };

      const finalData = {
        ...mergedData,
      };

      await updateInstrument({
        id: instrumentId,
        data: finalData,
      });

      queryClient.invalidateQueries({ queryKey: getGetInstrumentsQueryKey() });
      if (callback?.length) callback.forEach((cb) => cb());
      toast({ title: "Security updated successfully", variant: "primary" });
    } catch (error) {
      console.error("Error updating security", error);
      toast({ title: "Failed to update security", variant: "destructive" });
    }
  };

  return {
    handleUpdate,
    isUpdating,
  };
};
