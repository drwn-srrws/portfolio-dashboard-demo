import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CompanyRatingPost, PaginatedCompanyResponse } from "@api/types";
import { setRating } from "@api/endpoints/company/company";
import { hyphenatedDate } from "@/utils";
import { getListCompaniesV2CustomQueryKey } from "@/hooks/api/useListCompaniesV2";
import { useChangeHistory } from "@/modules/dashboard/providers/ChangeHistoryProvider";

export interface SetRatingVariables {
  companyId: number;
  data: CompanyRatingPost;
}

export const useOptimisticSetRating = () => {
  const queryClient = useQueryClient();
  const { addHistoryEntry } = useChangeHistory();

  return useMutation({
    mutationFn: async ({ companyId, data }: SetRatingVariables) => {
      return await setRating(companyId, data);
    },
    onMutate: async ({ companyId, data: rating }) => {
      await queryClient.cancelQueries({
        queryKey: getListCompaniesV2CustomQueryKey(),
      });

      const previousCompanies = queryClient.getQueriesData({
        queryKey: getListCompaniesV2CustomQueryKey(),
      });

      const date = hyphenatedDate(new Date());

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
                primary_analyst_rating: {
                  ...rating,
                  date,
                  created_at_utc: date,
                },
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
          entity: "rating",
          title: "Rating Updated",
          description: `Rating set to ${variables.data.rating}`,
          data: { companyId: variables.companyId },
        });
      }
    },
  });
};
