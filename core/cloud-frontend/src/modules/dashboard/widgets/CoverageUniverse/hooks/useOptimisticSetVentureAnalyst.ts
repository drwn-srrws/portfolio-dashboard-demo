import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createCompanyCoverage,
  deleteCompanyCoverage,
  getReadCompanyCoveragesQueryKey,
  patchCompanyCoverage,
} from "@api/endpoints/company/company";
import {
  CoverageType,
  PaginatedCompanyResponse,
  UserResponse,
} from "@api/types";
import { getListCompaniesV2CustomQueryKey } from "@/hooks/api/useListCompaniesV2";
import { useChangeHistory } from "@/modules/dashboard/providers/ChangeHistoryProvider";
import { hyphenatedDate } from "@/utils/dates";

export interface SetVentureAnalystVariables {
  companyId: number;
  data: UserResponse | null;
  currentCoverageId: number | null;
}

export const useOptimisticSetVentureAnalyst = () => {
  const queryClient = useQueryClient();
  const { addHistoryEntry } = useChangeHistory();

  return useMutation({
    mutationFn: async ({
      companyId,
      data,
      currentCoverageId,
    }: SetVentureAnalystVariables) => {
      if (data === null) {
        if (currentCoverageId === null) return;
        return await deleteCompanyCoverage(currentCoverageId);
      }

      if (currentCoverageId !== null) {
        return await patchCompanyCoverage(currentCoverageId, {
          user_id: data.id,
        });
      }

      return await createCompanyCoverage({
        company_id: companyId,
        user_id: data.id,
        coverage_type: CoverageType.venture_analyst,
        effective_start_date: hyphenatedDate(new Date()),
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
              return { ...item, venture_analyst: user };
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
      queryClient.invalidateQueries({
        queryKey: getReadCompanyCoveragesQueryKey(),
      });

      if (!error) {
        const analystName = variables.data
          ? `${variables.data.first_name} ${variables.data.last_name}`
          : "None";
        addHistoryEntry({
          type: "update",
          entity: "venture_analyst",
          title: "Venture Analyst Updated",
          description: `Analyst: ${analystName}`,
          data: { companyId: variables.companyId },
        });
      }
    },
  });
};
