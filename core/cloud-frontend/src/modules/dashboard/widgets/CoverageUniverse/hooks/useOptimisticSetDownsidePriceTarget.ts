import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CompanyPriceTargetPost, PaginatedCompanyResponse } from "@api/types";
import { setDownsidePriceTarget } from "@api/endpoints/company/company";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { hyphenatedDate } from "@/utils";
import { getListCompaniesV2CustomQueryKey } from "@/hooks/api/useListCompaniesV2";
import { useChangeHistory } from "@/modules/dashboard/providers/ChangeHistoryProvider";

export interface SetDownsidePriceTargetVariables {
  companyId: number;
  data: CompanyPriceTargetPost;
}

export const useOptimisticSetDownsidePriceTarget = () => {
  const queryClient = useQueryClient();
  const { account: user } = useAuth();
  const { addHistoryEntry } = useChangeHistory();

  return useMutation({
    mutationFn: async ({
      companyId,
      data,
    }: SetDownsidePriceTargetVariables) => {
      return await setDownsidePriceTarget(companyId, data);
    },
    onMutate: async ({ companyId, data }) => {
      await queryClient.cancelQueries({
        queryKey: getListCompaniesV2CustomQueryKey(),
      });

      const previousCompanies = queryClient.getQueriesData({
        queryKey: getListCompaniesV2CustomQueryKey(),
      });

      const priceTarget = {
        price_target_usd: data.price_target_usd,
        created_by: user,
        created_at_utc: hyphenatedDate(new Date()),
      };

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
                primary_analyst_downside_price_target: priceTarget,
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
        addHistoryEntry({
          type: "update",
          entity: "downside_price_target",
          title: "Downside Price Target Updated",
          description: `Price target: $${variables.data.price_target_usd}`,
          data: { companyId: variables.companyId },
        });
      }
    },
  });
};
