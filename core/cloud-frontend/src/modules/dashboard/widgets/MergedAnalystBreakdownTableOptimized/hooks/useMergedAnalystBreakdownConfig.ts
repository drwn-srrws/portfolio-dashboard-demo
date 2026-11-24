import { useMemo } from "react";
import { useGetMergedAlphaAnalystBreakdownConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";

export interface MergedAnalystBreakdownConfig {
  supportedFilters: string[];
}

const FALLBACK_CONFIG: MergedAnalystBreakdownConfig = {
  supportedFilters: [],
};

export const useMergedAnalystBreakdownConfig = () => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetMergedAlphaAnalystBreakdownConfigEndpoint();

  const config: MergedAnalystBreakdownConfig = useMemo(() => {
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
