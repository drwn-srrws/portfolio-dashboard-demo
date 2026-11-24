import { useMemo } from "react";
import { useGetTopWinnersAndLosersInvestmentConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import { TopWinnersAndLosersInvestmentRequestTopN } from "@/api/types";
import { DateRangeRequest, DateRangeRequestPeriod } from "@/api/aliases";

export interface WinnersAndLosersConfig {
  supportedFilters: string[];
  defaultDateRange?: DateRangeRequest;
  topN: TopWinnersAndLosersInvestmentRequestTopN;
  supportedTopN: string[];
  supportedDateRanges: DateRangeRequestPeriod[];
}

const FALLBACK_CONFIG: WinnersAndLosersConfig = {
  supportedFilters: [],
  topN: TopWinnersAndLosersInvestmentRequestTopN.Top_10,
  supportedTopN: [
    TopWinnersAndLosersInvestmentRequestTopN.Top_5,
    TopWinnersAndLosersInvestmentRequestTopN.Top_10,
    TopWinnersAndLosersInvestmentRequestTopN.Top_20,
    TopWinnersAndLosersInvestmentRequestTopN.Show_All,
  ],
  supportedDateRanges: ["DTD", "WTD", "MTD", "QTD", "YTD"],
};

export const useWinnersAndLosersConfig = () => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetTopWinnersAndLosersInvestmentConfigEndpoint();

  const config: WinnersAndLosersConfig = useMemo(() => {
    const metadata = configData?.metadata;
    if (!metadata) return FALLBACK_CONFIG;

    const supportedTopN = metadata.supported_top_n?.length
      ? metadata.supported_top_n
      : [metadata.top_n];

    return {
      supportedFilters: metadata.supported_filters ?? [],
      defaultDateRange: metadata.date_range,
      topN: metadata.top_n as TopWinnersAndLosersInvestmentRequestTopN,
      supportedTopN,
      supportedDateRanges: (metadata.supported_date_ranges ??
        FALLBACK_CONFIG.supportedDateRanges) as DateRangeRequestPeriod[],
    };
  }, [configData]);

  return { config, isLoading, isError };
};
