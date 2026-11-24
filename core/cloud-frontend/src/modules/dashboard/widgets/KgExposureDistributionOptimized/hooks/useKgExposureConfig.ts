import { useMemo } from "react";
import { useGetKgExposureConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";

export interface KgExposureConfig {
  supportedFilters: string[];
}

const FALLBACK_CONFIG: KgExposureConfig = {
  supportedFilters: [],
};

export const useKgExposureConfig = () => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetKgExposureConfigEndpoint();

  const config: KgExposureConfig = useMemo(() => {
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
