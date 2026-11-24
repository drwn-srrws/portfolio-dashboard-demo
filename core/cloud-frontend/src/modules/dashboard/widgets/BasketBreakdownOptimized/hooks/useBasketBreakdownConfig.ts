import { useMemo } from "react";
import { useGetBasketBreakdownConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";

export interface BasketBreakdownConfig {
  supportedFilters: string[];
}

const FALLBACK_CONFIG: BasketBreakdownConfig = {
  supportedFilters: [],
};

export const useBasketBreakdownConfig = () => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetBasketBreakdownConfigEndpoint();

  const config: BasketBreakdownConfig = useMemo(() => {
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
