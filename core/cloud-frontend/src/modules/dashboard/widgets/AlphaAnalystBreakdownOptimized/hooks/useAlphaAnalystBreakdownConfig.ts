import { useMemo } from "react";

import { useGetAlphaAnalystBreakdownConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";

export interface AlphaAnalystBreakdownConfig {
  supportedFilters: string[];
}

const FALLBACK_CONFIG: AlphaAnalystBreakdownConfig = {
  supportedFilters: [],
};

export const useAlphaAnalystBreakdownConfig = () => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetAlphaAnalystBreakdownConfigEndpoint();

  const config: AlphaAnalystBreakdownConfig = useMemo(() => {
    const metadata = configData?.metadata;

    if (!metadata) {
      return FALLBACK_CONFIG;
    }

    return {
      supportedFilters: metadata.supported_filters || [],
    };
  }, [configData]);

  return {
    config,
    isLoading,
    isError,
  };
};
