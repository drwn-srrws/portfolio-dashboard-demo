import { useMemo } from "react";
import { useGetBattingSluggingConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";

export interface BattingSluggingConfig {
  selectableDimensions: string[];
  requiredDimensions: string[];
  supportedFilters: string[];
  defaultDateRange?: {
    period?: string | null;
    start_date?: string | null;
    end_date?: string | null;
  };
}

const FALLBACK_BATTING_SLUGGING_CONFIG: BattingSluggingConfig = {
  selectableDimensions: [],
  requiredDimensions: [],
  supportedFilters: [],
};

export const useBattingSluggingConfig = () => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetBattingSluggingConfigEndpoint();

  const config: BattingSluggingConfig = useMemo(() => {
    const metadata = configData?.metadata;

    if (!metadata) {
      return FALLBACK_BATTING_SLUGGING_CONFIG;
    }

    const groupByConfig = metadata.group_by_config;

    return {
      selectableDimensions: groupByConfig?.selectable_dimensions || [],
      requiredDimensions: groupByConfig?.required_dimensions || [],
      supportedFilters: metadata.supported_filters || [],
      defaultDateRange: metadata.date_range,
    };
  }, [configData]);

  return {
    config,
    isLoading,
    isError,
  };
};
