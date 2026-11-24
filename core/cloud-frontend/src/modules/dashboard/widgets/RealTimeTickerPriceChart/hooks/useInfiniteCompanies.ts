import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  getListCompaniesV2QueryKey,
  listCompaniesV2,
} from "@api/endpoints/company/company";
import {
  CompanyCatalogRequestFilters,
  CompanyListRequest,
  CompanyLogicalFilter,
  CompanyLogicalFilterFiltersItem,
  ComparisonOperator,
  LogicalOperator,
} from "@api/types";
import { useState, useRef, useCallback } from "react";
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

  const searchQueryFilters: CompanyLogicalFilter = {
    op: LogicalOperator.or,
    filters: [
      {
        field: "name",
        op: ComparisonOperator.icontains,
        value: searchQuery,
      },
      {
        field: "primary_instrument.ticker",
        op: ComparisonOperator.icontains,
        value: searchQuery,
      },
    ],
  };

  const defaultFilters: CompanyLogicalFilterFiltersItem[] = [
    ...(params.filter ? [params.filter] : []),
    ...(searchQuery ? [searchQueryFilters] : []),
  ];

  const filter: CompanyCatalogRequestFilters = {
    op: LogicalOperator.and,
    filters: defaultFilters,
  };

  const { data, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      ...options,
      queryKey: getListCompaniesV2QueryKey(params),
      queryFn: async ({ pageParam }) => {
        const page = typeof pageParam === "number" ? pageParam : 1;
        const response = await listCompaniesV2({
          ...params,
          page: page,
          filter: filter,
        });
        const nextPage =
          response?.total_pages && response.total_pages > page
            ? page + 1
            : null;
        return { ...response, nextPage };
      },
      getNextPageParam: (lastPage) => lastPage?.nextPage ?? null,
      // placeholderData: keepPreviousData,
      initialPageParam: 1,
    });

  const companies = data?.pages.flatMap((page) => page.items);
  const companyOptions = companies?.map((company) => ({
    value: String(company.id),
    label: company.name,
  }));

  return {
    companies,
    options: companyOptions || [],
    fetchNextPage: () => {
      return isFetchingNextPage ? undefined : fetchNextPage();
    },
    isFetchingNextPage: isFetchingNextPage,
    debouncedSearchQuery,
    searchInputValue,
    isLoading,
  };
};
