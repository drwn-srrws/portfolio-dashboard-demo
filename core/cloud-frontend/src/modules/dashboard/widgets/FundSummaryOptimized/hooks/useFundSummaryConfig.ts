import { useMemo } from "react";
import { useGetFundSummaryConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";

export interface FundSummaryConfig {
  supportedFilters: string[];
}

const FALLBACK_CONFIG: FundSummaryConfig = {
  supportedFilters: [],
};

export const useFundSummaryConfig = () => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetFundSummaryConfigEndpoint();

  const config: FundSummaryConfig = useMemo(() => {
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
