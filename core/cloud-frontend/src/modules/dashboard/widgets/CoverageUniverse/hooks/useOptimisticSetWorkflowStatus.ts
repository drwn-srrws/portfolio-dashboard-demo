import { useQueryClient } from "@tanstack/react-query";
import { useUpdateCompanyV2 } from "@api/endpoints/company/company";
import { PaginatedCompanyResponse } from "@api/types";
import { getListCompaniesV2CustomQueryKey } from "@/hooks/api/useListCompaniesV2";
import { useChangeHistory } from "@/modules/dashboard/providers/ChangeHistoryProvider";

export const useOptimisticSetWorkflowStatus = () => {
  const queryClient = useQueryClient();
  const { addHistoryEntry } = useChangeHistory();

  return useUpdateCompanyV2({
    mutation: {
      onMutate: async ({ companyId, data: { workflow_status } }) => {
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
      onSettled: (_data, error, variables) => {
        if (!error) {
          const status = variables.data.workflow_status || "None";
          addHistoryEntry({
            type: "update",
            entity: "workflow_status",
            title: "Workflow Status Updated",
            description: `Status: ${status}`,
            data: { companyId: variables.companyId },
          });
        }
      },
    },
  });
};
