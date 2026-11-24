import { useMemo } from "react";

import { useGetPnlByNewCompaniesAnalystConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import type { DateRangeRequest } from "@/api/aliases";

export interface PnlByNewCompaniesAnalystViewConfig {
  supportedFilters: string[];
  displayNameMap: Record<string, string>;
  defaultDateRange?: DateRangeRequest;
}

const FALLBACK_CONFIG: PnlByNewCompaniesAnalystViewConfig = {
  supportedFilters: [],
  displayNameMap: {},
};

/**
 * Config hook for the PnL by New Companies (Analyst View) card.
 * Mirrors the shape of `usePnlBySubteamConfig`.
 */
export const usePnlByNewCompaniesAnalystViewConfig = () => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetPnlByNewCompaniesAnalystConfigEndpoint();

  const config: PnlByNewCompaniesAnalystViewConfig = useMemo(() => {
    const metadata = configData?.metadata;
    if (!metadata) return FALLBACK_CONFIG;
    return {
      supportedFilters: metadata.supported_filters ?? [],
      displayNameMap: metadata.display_name_map ?? {},
      defaultDateRange: metadata.date_range,
    };
  }, [configData]);

  return { config, isLoading, isError };
};
