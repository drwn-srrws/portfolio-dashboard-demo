import { useMemo } from "react";

import { useGetPnlByNewCompaniesCompanyConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import type { DateRangeRequest } from "@/api/aliases";

export interface PnlByNewCompaniesCompanyViewConfig {
  supportedFilters: string[];
  displayNameMap: Record<string, string>;
  defaultDateRange?: DateRangeRequest;
  displayColumns: string[];
}

const FALLBACK_CONFIG: PnlByNewCompaniesCompanyViewConfig = {
  supportedFilters: [],
  displayNameMap: {},
  displayColumns: [],
};

export const usePnlByNewCompaniesCompanyViewConfig = () => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetPnlByNewCompaniesCompanyConfigEndpoint();

  const config: PnlByNewCompaniesCompanyViewConfig = useMemo(() => {
    const metadata = configData?.metadata;
    if (!metadata) return FALLBACK_CONFIG;
    return {
      supportedFilters: metadata.supported_filters ?? [],
      displayNameMap: metadata.display_name_map ?? {},
      defaultDateRange: metadata.date_range,
      displayColumns: metadata.display_columns ?? [],
    };
  }, [configData]);

  return { config, isLoading, isError };
};
