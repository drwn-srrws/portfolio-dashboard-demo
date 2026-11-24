import { useMemo } from "react";
import { useGetAnalystBreakdownConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";

export interface AnalystBreakdownConfig {
  supportedFilters: string[];
}

const FALLBACK_CONFIG: AnalystBreakdownConfig = {
  supportedFilters: [],
};

export const useAnalystBreakdownConfig = () => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetAnalystBreakdownConfigEndpoint();

  const config: AnalystBreakdownConfig = useMemo(() => {
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
