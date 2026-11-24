import { useQuery } from "@tanstack/react-query";
import { AXIOS_INSTANCE } from "@/api/mutator/custom-instance";
import { Resource } from "../types";
import { getReadSubsectorsQueryKey } from "@/api/endpoints/company/company";

interface UseDefaultResourceProps {
  resource?: Resource;
}

type DefaultQueryResource = Resource.subsector | Resource.country;

interface ResourceConfig {
  key: readonly unknown[];
  queryResource: () => Promise<{ value: string; label: string }[]>;
}

const defaultQueriesMap: Record<DefaultQueryResource, ResourceConfig> = {
  [Resource.subsector]: {
    key: getReadSubsectorsQueryKey(),
    queryResource: async () => {
      const response = await AXIOS_INSTANCE.get<{ id: number; name: string }[]>(
        "/api/dev/company/subsector"
      );
      return (response?.data || []).map((row) => ({
        value: row.id.toString(),
        label: row.name,
      }));
    },
  },
  [Resource.country]: {
    key: ["api", "dev", "company", "country"],
    queryResource: async () => {
      const response = await AXIOS_INSTANCE.get<{ code: string }[]>(
        "/api/dev/company/country"
      );
      return (response?.data || []).map((row) => ({
        value: row.code,
        label: row.code,
      }));
    },
  },
};

export const useDefaultResource = ({ resource }: UseDefaultResourceProps) => {
  const { data } = useQuery({
    queryKey: [
      resource
        ? defaultQueriesMap[resource as DefaultQueryResource]?.key
        : ["unknown-resource"],
    ],
    queryFn: () => {
      if (!resource) {
        throw new Error("Resource cannot be null");
      }
      return defaultQueriesMap[
        resource as DefaultQueryResource
      ].queryResource();
    },
    enabled: !!resource && resource in defaultQueriesMap,
  });

  return {
    data,
    fetchNextPage: () => {},
    hasNextPage: false,
    isFetchingNextPage: false,
    supportsClientFilter: true,
  };
};
