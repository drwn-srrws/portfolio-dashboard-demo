import { useMemo } from "react";
import { useGetMarketCapDistributionConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";

export interface MarketCapDistributionConfig {
  supportedFilters: string[];
}

const FALLBACK_CONFIG: MarketCapDistributionConfig = {
  supportedFilters: [],
};

export const useMarketCapDistributionConfig = () => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetMarketCapDistributionConfigEndpoint();

  const config: MarketCapDistributionConfig = useMemo(() => {
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
