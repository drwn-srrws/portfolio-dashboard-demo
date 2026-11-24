import { useQueryClient } from "@tanstack/react-query";
import { useUpdateCompanyV2 } from "@api/endpoints/company/company";
import { PaginatedCompanyResponse } from "@api/types";
import { getListEventTrackerCustomQueryKey } from "@/hooks/api/useListEventTracker";

export const useOptimisticSetWorkflowStatus = () => {
  const queryClient = useQueryClient();

  return useUpdateCompanyV2({
    mutation: {
      onMutate: async ({ companyId, data: { workflow_status } }) => {
        const previousCompanies = queryClient.getQueriesData({
          queryKey: getListEventTrackerCustomQueryKey(),
        });

        queryClient.setQueriesData(
          { queryKey: getListEventTrackerCustomQueryKey() },
          (data: PaginatedCompanyResponse | undefined) => {
            if (!data) return data;

            return {
              ...data,
              items: data.items.map((item) => {
                if (item.id !== companyId) return item;

                return {
                  ...item,
                  workflow_status: workflow_status,
                };
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
    },
  });
};
