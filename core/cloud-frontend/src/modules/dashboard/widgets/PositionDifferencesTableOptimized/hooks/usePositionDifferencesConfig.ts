import { useMemo } from "react";
import { useGetPositionDifferencesConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";

export interface PositionDifferencesConfig {
  groupByMetrics: string[];
  requiredDimensions: string[];
  fundCombinations: Array<{ fund_1: string; fund_2: string }>;
  supportedFilters: string[];
}

const FALLBACK_POSITION_DIFFERENCES_CONFIG: PositionDifferencesConfig = {
  groupByMetrics: [],
  requiredDimensions: [],
  fundCombinations: [],
  supportedFilters: [],
};

export const usePositionDifferencesConfig = () => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetPositionDifferencesConfigEndpoint();

  const config: PositionDifferencesConfig = useMemo(() => {
    const metadata = configData?.metadata;

    if (!metadata) {
      return FALLBACK_POSITION_DIFFERENCES_CONFIG;
    }

    const groupByConfig = metadata.group_by_config;
    const fundCombinations = metadata.fund_combinations || [];

    return {
      groupByMetrics: groupByConfig?.selectable_dimensions || [],
      requiredDimensions: groupByConfig?.required_dimensions || [],
      fundCombinations,
      supportedFilters: metadata.supported_filters || [],
    };
  }, [configData]);

  return {
    config,
    isLoading,
    isError,
  };
};
