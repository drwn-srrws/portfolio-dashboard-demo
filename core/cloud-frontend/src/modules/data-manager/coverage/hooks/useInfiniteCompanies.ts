import {
  keepPreviousData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getListCompaniesV2QueryKey,
  listCompaniesV2,
} from "@/api/endpoints/company/company";
import { CompanyListRequest } from "@api/types";
import { useCallback, useRef, useState } from "react";
import { debounce } from "@/utils";

export interface UseInfiniteCompaniesOptions {
  enabled?: boolean;
}

export const useInfiniteCompanies = (
  params: CompanyListRequest,
  options?: UseInfiniteCompaniesOptions
) => {
  const queryClient = useQueryClient();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSetSearchQueryRef = useRef(
    debounce((value: string) => {
      queryClient.removeQueries({
        queryKey: getListCompaniesV2QueryKey(params),
      });
      setSearchQuery(value);
    }, 300)
  );

  const debouncedSearchQuery = useCallback(
    (value: string) => {
      setSearchInputValue(value);
      debouncedSetSearchQueryRef.current(value);
    },
    [setSearchInputValue]
  );

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    ...options,
    queryKey: getListCompaniesV2QueryKey(params),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await listCompaniesV2({
        ...params,
        page: pageParam,
        filter: searchQuery
          ? {
              field: "name",
              op: "icontains",
              value: searchQuery,
            }
          : undefined,
      });
      const nextPage = response?.total_pages > pageParam ? pageParam + 1 : null;
      return { ...response, nextPage };
    },
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? null,
    placeholderData: keepPreviousData,
    initialPageParam: 1,
  });

  const companies = data?.pages.flatMap((page) => page.items);
  const companyOptions = companies?.map((company) => ({
    value: String(company.id),
    label: company.name,
  }));

  return {
    companies,
    companyOptions,
    fetchNextPage: () => {
      return isFetchingNextPage ? undefined : fetchNextPage();
    },
    isFetchingNextPage: isFetchingNextPage,
    debouncedSearchQuery,
    searchInputValue,
  };
};
