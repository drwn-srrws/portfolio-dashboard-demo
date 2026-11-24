import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { useCreateCompanyV2 } from "@/api/endpoints/company/company";
import { getGetInstrumentsQueryKey } from "@/api/endpoints/instrument/instrument";
import { CreateCompany } from "@/api/types";
import { getListCompaniesV2CustomQueryKey } from "@/hooks/api/useListCompaniesV2";
import { EditCompanyFormData } from "../editCompanySchema";
import {
  formatTextFieldValues,
  formatSingleSelectFields,
  formatMultiSelectFields,
} from "../../../helpers/formatFieldValues";
import { Selectable } from "@/typings/Selectable";
export const useCreateSecurityCompany = ({
  callback,
}: {
  callback?: (() => void)[];
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync: executeCreateCompany, isPending: isCreatingCompany } =
    useCreateCompanyV2({
      mutation: {
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: getListCompaniesV2CustomQueryKey(),
          });

          queryClient.invalidateQueries({
            queryKey: getGetInstrumentsQueryKey(),
          });
        },
      },
    });

  const createCompany = async (
    values: EditCompanyFormData & {
      [key: string]: string | Selectable | Selectable[] | null;
    }
  ) => {
    try {
      const singleSelectsData = formatSingleSelectFields(values);
      const multiSelectsData = formatMultiSelectFields(values);
      const textFieldsData = formatTextFieldValues(values);

      const finalData = {
        ...textFieldsData,
        ...singleSelectsData,
        ...multiSelectsData,
      };

      const data: CreateCompany = {
        name: (values.name as string) || "",
        ...finalData,
      };

      await executeCreateCompany({ data });

      toast({ title: "Company created successfully", variant: "primary" });

      if (callback?.length) callback.forEach((cb) => cb());
    } catch (error) {
      console.error("Error creating company", error);
      toast({ title: "Failed to create company", variant: "destructive" });
    }
  };

  return { createCompany, isCreatingCompany };
};
