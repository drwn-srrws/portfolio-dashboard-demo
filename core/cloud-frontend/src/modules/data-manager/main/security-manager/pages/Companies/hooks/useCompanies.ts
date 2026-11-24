import { keepPreviousData } from "@tanstack/react-query";
import {
  CompanyListRequestSortBy,
  CompanyListRequestSortOrder,
} from "@/api/types";
import { useListCompaniesV2 } from "@/hooks/api/useListCompaniesV2";

export interface UseCompaniesProps {
  page: number;
  pageSize: number;
  sortBy: CompanyListRequestSortBy;
  sortOrder: CompanyListRequestSortOrder;
  search: string | null;
}

export const useCompanies = ({
  page,
  pageSize,
  sortBy,
  sortOrder,
  search,
}: UseCompaniesProps) => {
  return useListCompaniesV2(
    {
      page,
      page_size: pageSize,
      sort_by: sortBy,
      sort_order: sortOrder,
      includes: ["instruments"],
      ...(search && {
        filter: {
          op: "and",
          filters: [
            {
              field: "name",
              op: "icontains",
              value: search,
            },
          ],
        },
      }),
    },
    {
      query: {
        placeholderData: keepPreviousData,
      },
    }
  );
};
