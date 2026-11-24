import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import {
  useUpdateCompanyV2,
  getGetCompanyInstrumentsQueryKey,
} from "@/api/endpoints/company/company";
import { UpdateCompany } from "@/api/types";

import { getListCompaniesV2CustomQueryKey } from "@/hooks/api/useListCompaniesV2";
import { getGetCompanyV2QueryKey } from "@/api/endpoints/company/company";
import {
  formatTextFieldValues,
  formatMultiSelectFields,
  formatSingleSelectFields,
} from "../../../helpers/formatFieldValues";
import { EditCompanyFormData } from "../editCompanySchema";
import { Selectable } from "@/typings/Selectable";
export const useEditSecurityCompany = ({
  companyId,
  callback,
}: {
  companyId: number;
  callback?: (() => void)[];
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync: executeUpdateCompany, isPending: isUpdatingCompany } =
    useUpdateCompanyV2({
      mutation: {
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: getListCompaniesV2CustomQueryKey(),
          });

          queryClient.invalidateQueries({
            queryKey: getGetCompanyInstrumentsQueryKey(companyId),
          });

          queryClient.invalidateQueries({
            queryKey: getGetCompanyV2QueryKey(companyId),
          });
        },
      },
    });

  const updateCompany = async (
    values: EditCompanyFormData & {
      [key: string]: string | Selectable | Selectable[] | null;
    }
  ) => {
    try {
      if (!companyId) return;

      const singleSelectsData = formatSingleSelectFields(values);
      const multiSelectsData = formatMultiSelectFields(values);
      const textFieldsData = formatTextFieldValues(values);

      const finalData: Record<string, string | string[] | number | null> = {
        ...textFieldsData,
        ...singleSelectsData,
        ...multiSelectsData,
      };

      if (finalData.primary_instrument_id) {
        finalData.primary_instrument_id = Number(
          finalData.primary_instrument_id
        );
      }

      const data: UpdateCompany = {
        ...finalData,
      };

      await executeUpdateCompany({ companyId, data });

      if (callback?.length) callback.forEach((cb) => cb());

      toast({ title: "Company updated successfully", variant: "primary" });
    } catch (error) {
      console.error("Error updating company", error);
      toast({ title: "Failed to update company", variant: "destructive" });
    }
  };

  return { updateCompany, isUpdatingCompany };
};
