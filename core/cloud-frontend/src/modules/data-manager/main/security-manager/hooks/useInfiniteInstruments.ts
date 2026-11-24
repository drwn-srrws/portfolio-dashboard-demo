import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import {
  getGetInstrumentsQueryKey,
  getInstruments,
} from "@api/endpoints/instrument/instrument";
import { GetInstrumentsParams } from "@api/types";

export const useInfiniteInstruments = (params: GetInstrumentsParams) => {
  return useInfiniteQuery({
    queryKey: getGetInstrumentsQueryKey(params),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getInstruments({ ...params, page: pageParam });
      const nextPage = response?.total_pages > pageParam ? pageParam + 1 : null;
      return { ...response, nextPage };
    },
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? null,
    placeholderData: keepPreviousData,
    initialPageParam: 1,
  });
};
