import { useMemo } from "react";
import { useGetPortfolioSummaryConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";

export interface PortfolioSummaryConfig {
  selectableDimensions: string[];
  defaultGroupBy: string;
  supportedFilters: string[];
}

const FALLBACK_CONFIG: PortfolioSummaryConfig = {
  selectableDimensions: [],
  defaultGroupBy: "instrument_group",
  supportedFilters: [],
};

export const usePortfolioSummaryConfig = () => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetPortfolioSummaryConfigEndpoint();

  const config: PortfolioSummaryConfig = useMemo(() => {
    const metadata = configData?.metadata;
    if (!metadata) return FALLBACK_CONFIG;

    const selectable = metadata.group_by_config?.selectable_dimensions ?? [];
    const defaultDimensions =
      metadata.group_config_default?.selectable_dimensions ?? [];
    const defaultGroupBy =
      defaultDimensions[0] ?? selectable[0] ?? "instrument_group";

    return {
      selectableDimensions: selectable,
      defaultGroupBy,
      supportedFilters: metadata.supported_filters ?? [],
    };
  }, [configData]);

  return { config, isLoading, isError };
};
