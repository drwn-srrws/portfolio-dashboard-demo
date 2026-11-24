import {
  keepPreviousData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getGetUsersV2QueryKey, getUsersV2 } from "@api/endpoints/user/user";
import { GetUsersV2Params } from "@api/types";
import { useState, useRef, useCallback } from "react";
import { debounce } from "@/utils";

export interface UseInfiniteUsersOptions {
  enabled?: boolean;
}

export const useInfiniteUsers = (
  params: GetUsersV2Params,
  options?: UseInfiniteUsersOptions
) => {
  const queryClient = useQueryClient();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSetSearchQueryRef = useRef(
    debounce((value: string) => {
      queryClient.removeQueries({ queryKey: getGetUsersV2QueryKey(params) });
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
    queryKey: getGetUsersV2QueryKey(params),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getUsersV2({
        ...params,
        page: pageParam,
        search: searchQuery,
      });
      const nextPage = response?.total_pages > pageParam ? pageParam + 1 : null;
      return { ...response, nextPage };
    },
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? null,
    placeholderData: keepPreviousData,
    initialPageParam: 1,
  });

  const users = data?.pages.flatMap((page) => page.items);
  const userOptions = users?.map((user) => ({
    value: String(user.id),
    label: `${user.first_name} ${user.last_name}`,
  }));

  return {
    users,
    userOptions,
    fetchNextPage: () => {
      return isFetchingNextPage ? undefined : fetchNextPage();
    },
    isFetchingNextPage: isFetchingNextPage,
    debouncedSearchQuery,
    searchInputValue,
  };
};
