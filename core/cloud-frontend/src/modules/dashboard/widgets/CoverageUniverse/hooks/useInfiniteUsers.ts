import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { getGetUsersV2QueryKey, getUsersV2 } from "@api/endpoints/user/user";
import { GetUsersV2Params } from "@api/types";

export interface UseInfiniteUsersOptions {
  enabled?: boolean;
}

export const useInfiniteUsers = (
  params: GetUsersV2Params,
  options?: UseInfiniteUsersOptions
) => {
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    ...options,
    queryKey: getGetUsersV2QueryKey(params),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getUsersV2({ ...params, page: pageParam });
      const nextPage = response?.total_pages > pageParam ? pageParam + 1 : null;
      return { ...response, nextPage };
    },
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? null,
    placeholderData: keepPreviousData,
    initialPageParam: 1,
  });

  return {
    data,
    fetchNextPage: () => {
      return isFetchingNextPage ? undefined : fetchNextPage();
    },
    isFetchingNextPage: isFetchingNextPage,
  };
};
