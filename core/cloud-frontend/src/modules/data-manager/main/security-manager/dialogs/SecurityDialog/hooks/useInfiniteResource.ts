import { useInfiniteQuery } from "@tanstack/react-query";
import { AXIOS_INSTANCE } from "@/api/mutator/custom-instance";
import { Resource } from "../types";
import { getGetUsersV2QueryKey } from "@/api/endpoints/user/user";
import { getGetInstrumentGroupsQueryKey } from "@/api/endpoints/instrument-group/instrument-group";
import { getListCompaniesV2CustomQueryKey } from "@/hooks/api/useListCompaniesV2";
import { CompanyListRequest, UserWithRelationshipsResponse } from "@/api/types";
import {
  getGetInstrumentsQueryKey,
  getGetPortfolioAssetClassesQueryKey,
  getGetSecurityCodeDisplaysQueryKey,
  getGetSecurityCodesQueryKey,
} from "@/api/endpoints/instrument/instrument";
import { getGetCompanyInstrumentsQueryKey } from "@/api/endpoints/company/company";
import type { CompanyInstrumentItem } from "@/api/types";

const PAGE_SIZE = 20;

interface UseInfiniteResourceProps {
  resource?: Resource;
  searchQuery?: string;
  params?: Record<string, string | number>;
}

type InfiniteQueryResource = Exclude<
  Resource,
  Resource.subsector | Resource.country
>;

const infiniteQueriesMap = {
  [Resource.company]: {
    key: getListCompaniesV2CustomQueryKey(),
    fn: (page_size: number, page: number, searchQuery: string) => {
      const request: CompanyListRequest = {
        page,
        page_size,
        sort_order: "asc",
        sort_by: "name",
        filter: searchQuery
          ? {
              field: "name",
              op: "icontains",
              value: searchQuery,
            }
          : undefined,
      };
      return AXIOS_INSTANCE.post("/api/dev/v2/company/list", request, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    },
  },
  [Resource["instrument-group"]]: {
    key: getGetInstrumentGroupsQueryKey(),
    fn: (page_size: number, page: number, searchQuery: string) =>
      AXIOS_INSTANCE.get("/api/dev/instrument-group/", {
        params: { page_size, page, search: searchQuery },
      }),
  },
  [Resource.user]: {
    key: getGetUsersV2QueryKey(),
    fn: (page_size: number, page: number, searchQuery: string) =>
      AXIOS_INSTANCE.get("/api/dev/v2/user/", {
        params: { page_size, page, search: searchQuery },
      }),
  },
  [Resource.instrument]: {
    key: getGetInstrumentsQueryKey(),
    fn: (page_size: number, page: number, searchQuery: string) =>
      AXIOS_INSTANCE.get("/api/dev/instrument/", {
        params: { page_size, page, search: searchQuery },
      }),
  },
  [Resource.security_code]: {
    key: getGetSecurityCodesQueryKey(),
    fn: (page_size: number, page: number, searchQuery: string) =>
      AXIOS_INSTANCE.get("/api/dev/instrument/security-code", {
        params: { page_size, page, search: searchQuery },
      }),
  },
  [Resource.security_code_display]: {
    key: getGetSecurityCodeDisplaysQueryKey(),
    fn: (page_size: number, page: number, searchQuery: string) =>
      AXIOS_INSTANCE.get("/api/dev/instrument/security-code-display", {
        params: { page_size, page, search: searchQuery },
      }),
  },
  [Resource["primary-instrument"]]: {
    key: (params?: Record<string, string | number>) =>
      getGetCompanyInstrumentsQueryKey(params?.company_id as number),
    fn: (
      page_size: number,
      page: number,
      searchQuery: string,
      params?: Record<string, string | number>
    ) =>
      AXIOS_INSTANCE.get(
        `/api/dev/v2/company/${params?.company_id}/instruments`,
        {
          params: { page_size, page, search: searchQuery },
        }
      ),
  },
  [Resource.portfolio_asset_class]: {
    key: getGetPortfolioAssetClassesQueryKey(),
    fn: (page_size: number, page: number, searchQuery: string) =>
      AXIOS_INSTANCE.get("/api/dev/instrument/portfolio-asset-class", {
        params: { page_size, page, search: searchQuery },
      }),
  },
};

const fetchInfiniteQuery = async ({
  resource,
  page_size,
  page,
  searchQuery,
  params,
}: {
  resource: InfiniteQueryResource | null;
  page_size: number;
  page: number;
  searchQuery: string;
  params?: Record<string, string | number>;
}) => {
  if (!resource) {
    throw new Error("Resource cannot be null");
  }
  const response = await infiniteQueriesMap[resource].fn(
    page_size,
    page,
    searchQuery,
    params
  );

  const nextPage = response?.data?.total_pages > page ? page + 1 : null;

  if (resource === Resource.user) {
    return {
      items: response?.data?.items?.map(
        (item: UserWithRelationshipsResponse) => ({
          id: item.id,
          name: item.first_name + " " + item.last_name,
        })
      ),
      nextPage,
    };
  }

  if (
    resource === Resource.security_code ||
    resource === Resource.security_code_display ||
    resource === Resource.portfolio_asset_class
  ) {
    return {
      items: response?.data?.items?.map((code: string) => ({
        id: code,
        name: code,
      })),
      nextPage,
    };
  }

  return {
    items: response?.data?.items,
    nextPage,
  };
};

const getQueryKey = (
  resource: InfiniteQueryResource,
  params?: Record<string, string | number>
) => {
  const keyOrFn = infiniteQueriesMap[resource]?.key;
  if (typeof keyOrFn === "function") {
    return keyOrFn(params);
  }
  return keyOrFn;
};

export const useInfiniteResource = ({
  resource,
  searchQuery,
  params,
}: UseInfiniteResourceProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [
        resource
          ? getQueryKey(resource as InfiniteQueryResource, params)
          : ["unknown-resource"],
        searchQuery,
        params,
      ],
      queryFn: ({ pageParam = 1 }) =>
        fetchInfiniteQuery({
          resource: (resource as InfiniteQueryResource) || null,
          page_size: PAGE_SIZE,
          page: pageParam,
          searchQuery: searchQuery || "",
          params,
        }),
      getNextPageParam: (lastPage) => {
        return lastPage?.nextPage || null;
      },
      initialPageParam: 1,
      enabled:
        !!resource &&
        resource in infiniteQueriesMap &&
        (resource !== Resource["primary-instrument"] || !!params?.company_id),
    });

  const resourceData = data?.pages.flatMap((page) => page.items) || [];

  const formattedData = resourceData.map(
    (item: { id: number; name: string; portfolio_asset_class?: string | null }) => {
      if (resource === Resource["primary-instrument"]) {
        const instrument = item as CompanyInstrumentItem;
        const portfolioAssetClass = instrument.portfolio_asset_class || "";
        return {
          value: instrument.id.toString(),
          label: `${instrument.id} : ${instrument.name} : ${portfolioAssetClass}`,
        };
      }

      return {
        value: item.id.toString(),
        label: item.name,
      };
    }
  );

  return {
    data: formattedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    supportsClientFilter: false,
  };
};
