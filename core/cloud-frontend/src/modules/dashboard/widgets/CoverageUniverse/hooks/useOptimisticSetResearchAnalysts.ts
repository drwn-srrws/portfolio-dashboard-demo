import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PaginatedCompanyResponse, UserResponse } from "@api/types";
import { setResearchAnalysts } from "@api/endpoints/company/company";
import { getListCompaniesV2CustomQueryKey } from "@/hooks/api/useListCompaniesV2";
import { useChangeHistory } from "@/modules/dashboard/providers/ChangeHistoryProvider";

export interface SetPrimaryAnalystVariables {
  companyId: number;
  data: UserResponse[];
}

export const useOptimisticSetResearchAnalysts = () => {
  const queryClient = useQueryClient();
  const { addHistoryEntry } = useChangeHistory();

  return useMutation({
    mutationFn: async ({ companyId, data }: SetPrimaryAnalystVariables) => {
      return await setResearchAnalysts(companyId, {
        user_ids: data.map((user) => user.id),
      });
    },
    onMutate: async ({ companyId, data: users }) => {
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
              return { ...item, research_analysts: users };
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
        const analystCount = variables.data.length;
        addHistoryEntry({
          type: "update",
          entity: "research_analysts",
          title: "Research Analysts Updated",
          description: `${analystCount} analyst${analystCount !== 1 ? "s" : ""} assigned`,
          data: { companyId: variables.companyId },
        });
      }
    },
  });
};
