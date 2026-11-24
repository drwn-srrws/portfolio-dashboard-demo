import { useMemo } from "react";
import { useGetLiquiditySummaryConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";

export interface LiquiditySummaryConfig {
  supportedFilters: string[];
}

const FALLBACK_CONFIG: LiquiditySummaryConfig = {
  supportedFilters: [],
};

export const useLiquiditySummaryConfig = () => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetLiquiditySummaryConfigEndpoint();

  const config: LiquiditySummaryConfig = useMemo(() => {
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
