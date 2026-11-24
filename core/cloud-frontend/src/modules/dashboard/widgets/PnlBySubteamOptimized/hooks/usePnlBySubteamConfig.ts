import { useMemo } from "react";

import { useGetPnlBySubteamConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import type { DateRangeRequest } from "@/api/aliases";

export interface PnlBySubteamConfig {
  supportedFilters: string[];
  displayNameMap: Record<string, string>;
  defaultDateRange?: DateRangeRequest;
  benchmarks: Record<string, string>;
}

const FALLBACK_CONFIG: PnlBySubteamConfig = {
  supportedFilters: [],
  displayNameMap: {},
  benchmarks: {},
};

export const usePnlBySubteamConfig = () => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetPnlBySubteamConfigEndpoint();

  const config: PnlBySubteamConfig = useMemo(() => {
    const metadata = configData?.metadata;
    if (!metadata) return FALLBACK_CONFIG;

    return {
      supportedFilters: metadata.supported_filters ?? [],
      displayNameMap: metadata.display_name_map ?? {},
      defaultDateRange: metadata.date_range,
      benchmarks: configData?.benchmarks ?? {},
    };
  }, [configData]);

  return { config, isLoading, isError };
};
