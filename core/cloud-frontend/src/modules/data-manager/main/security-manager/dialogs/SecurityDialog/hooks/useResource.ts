import { Resource } from "../types";

import { useInfiniteResource } from "./useInfiniteResource";
import { useDefaultResource } from "./useDefaultResource";
import { FormFieldOptions } from "@/api/types";

interface UseResourceProps {
  resource?: Resource;
  searchQuery?: string;
  customOptions?: FormFieldOptions;
  params?: Record<string, string | number>;
}
const resourceMap = {
  [Resource.company]: useInfiniteResource,
  [Resource.user]: useInfiniteResource,
  [Resource["instrument-group"]]: useInfiniteResource,
  [Resource.subsector]: useDefaultResource,
  [Resource.country]: useDefaultResource,
  [Resource.instrument]: useInfiniteResource,
  [Resource.security_code]: useInfiniteResource,
  [Resource.security_code_display]: useInfiniteResource,
  [Resource.portfolio_asset_class]: useInfiniteResource,
  [Resource["primary-instrument"]]: useInfiniteResource,
};

export const useResource = ({
  resource,
  searchQuery,
  customOptions,
  params,
}: UseResourceProps) => {
  if (customOptions) {
    const data = customOptions.map((item) => ({
      label: item,
      value: item,
    }));

    return {
      data,
      fetchNextPage: () => {},
      hasNextPage: false,
      isFetchingNextPage: false,
      supportsClientFilter: true,
    };
  }

  if (!resource)
    return {
      data: [],
      fetchNextPage: () => {},
      hasNextPage: false,
      isFetchingNextPage: false,
      supportsClientFilter: true,
    };

  const queryHook = resourceMap[resource as keyof typeof resourceMap];
  return queryHook({ resource, searchQuery, params });
};
