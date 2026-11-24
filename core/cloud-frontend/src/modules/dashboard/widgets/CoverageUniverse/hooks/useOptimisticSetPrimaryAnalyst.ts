import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PaginatedCompanyResponse, UserResponse } from "@api/types";
import { setPrimaryAnalyst } from "@api/endpoints/company/company";
import { getListCompaniesV2CustomQueryKey } from "@/hooks/api/useListCompaniesV2";
import { useChangeHistory } from "@/modules/dashboard/providers/ChangeHistoryProvider";

export interface SetPrimaryAnalystVariables {
  companyId: number;
  data: UserResponse | null;
}

export const useOptimisticSetPrimaryAnalyst = () => {
  const queryClient = useQueryClient();
  const { addHistoryEntry } = useChangeHistory();

  return useMutation({
    mutationFn: async ({ companyId, data }: SetPrimaryAnalystVariables) => {
      return await setPrimaryAnalyst(companyId, {
        user_id: data ? data.id : null,
      });
    },
    onMutate: async ({ companyId, data: user }) => {
      await queryClient.cancelQueries({
        queryKey: getListCompaniesV2CustomQueryKey(),
      });

      const previousCompanies = queryClient.getQueriesData({
        queryKey: getListCompaniesV2CustomQueryKey(),
      });

      queryClient.setQueriesData(
        { queryKey: getListCompaniesV2CustomQueryKey() },
        (data: PaginatedCompanyResponse | undefined) => {
          if (!data) return data;

          return {
            ...data,
            items: data.items.map((item) => {
              if (item.id !== companyId) return item;
              return { ...item, primary_analyst: user };
            }),
          };
        }
      );

      return { previousCompanies };
    },
    onError: (_error, _variables, context) => {
      context?.previousCompanies.forEach(([queryKey, company]) => {
        queryClient.setQueryData(queryKey, company);
      });
    },
    onSettled: (_data, error, variables) => {
      if (!error) {
        const analystName = variables.data
          ? `${variables.data.first_name} ${variables.data.last_name}`
          : "None";
        addHistoryEntry({
          type: "update",
          entity: "primary_analyst",
          title: "Primary Analyst Updated",
          description: `Analyst: ${analystName}`,
          data: { companyId: variables.companyId },
        });
      }
    },
  });
};
