import { useMemo } from "react";
import { useGetFundBreakdownConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";

export interface FundBreakdownConfig {
  supportedFilters: string[];
}

const FALLBACK_CONFIG: FundBreakdownConfig = {
  supportedFilters: [],
};

export const useFundBreakdownConfig = () => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetFundBreakdownConfigEndpoint();

  const config: FundBreakdownConfig = useMemo(() => {
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
