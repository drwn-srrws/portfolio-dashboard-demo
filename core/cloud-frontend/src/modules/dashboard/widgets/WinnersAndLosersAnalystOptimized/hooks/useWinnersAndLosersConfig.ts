import { useMemo } from "react";
import { useGetTopWinnersAndLosersAnalystConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import { TopWinnersAndLosersAnalystRequestTopN } from "@/api/types";
import {
  type DateRangeRequest,
  type DateRangeRequestPeriod,
} from "@/api/aliases";

export interface WinnersAndLosersConfig {
  supportedFilters: string[];
  defaultDateRange?: DateRangeRequest;
  topN: TopWinnersAndLosersAnalystRequestTopN;
  supportedTopN: string[];
  supportedDateRanges: DateRangeRequestPeriod[];
  selectableDimensions: string[];
  defaultGroupBy: string;
}

const FALLBACK_CONFIG: WinnersAndLosersConfig = {
  supportedFilters: [],
  topN: TopWinnersAndLosersAnalystRequestTopN.Top_10,
  supportedTopN: [
    TopWinnersAndLosersAnalystRequestTopN.Top_5,
    TopWinnersAndLosersAnalystRequestTopN.Top_10,
    TopWinnersAndLosersAnalystRequestTopN.Top_20,
    TopWinnersAndLosersAnalystRequestTopN.Show_All,
  ],
  supportedDateRanges: ["DTD", "WTD", "MTD", "QTD", "YTD"],
  selectableDimensions: ["primary_analyst", "secondary_analyst"],
  defaultGroupBy: "primary_analyst",
};

export const useWinnersAndLosersConfig = () => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetTopWinnersAndLosersAnalystConfigEndpoint();

  const config: WinnersAndLosersConfig = useMemo(() => {
    const metadata = configData?.metadata;
    if (!metadata) return FALLBACK_CONFIG;

    const supportedTopN = metadata.supported_top_n?.length
      ? metadata.supported_top_n
      : [metadata.top_n];

    const selectable = metadata.group_by_config?.selectable_dimensions?.length
      ? metadata.group_by_config.selectable_dimensions
      : FALLBACK_CONFIG.selectableDimensions;

    const defaultDimensions =
      metadata.group_config_default?.selectable_dimensions ?? [];
    const defaultGroupBy =
      defaultDimensions[0] ?? selectable[0] ?? FALLBACK_CONFIG.defaultGroupBy;

    return {
      supportedFilters: metadata.supported_filters ?? [],
      defaultDateRange: metadata.date_range,
      topN: metadata.top_n as TopWinnersAndLosersAnalystRequestTopN,
      supportedTopN,
      supportedDateRanges: (metadata.supported_date_ranges ??
        FALLBACK_CONFIG.supportedDateRanges) as DateRangeRequestPeriod[],
      selectableDimensions: selectable,
      defaultGroupBy,
    };
  }, [configData]);

  return { config, isLoading, isError };
};
