import { useMemo } from "react";
import { useGetInstradayBars } from "@/api/endpoints/instrument/instrument";
import { keepPreviousData } from "@tanstack/react-query";
import { CompanyResponse } from "@/api/types";

export interface IntradayBar {
  instrument_id: number;
  instrument_bars: { timestamp: string; price: number }[];
}

export const useIntradayBarsData = (
  companies: CompanyResponse[] | undefined
) => {
  const primaryInstrumentIds = useMemo(() => {
    if (!companies) return [];

    return companies
      .map((company) => company.primary_instrument?.id)
      .filter((id): id is number => Boolean(id));
  }, [companies]);

  const {
    data: intradayBarsData,
    isFetching: isLoadingIntradayBars,
    isPlaceholderData: isPlaceholderDataIntradayBars,
  } = useGetInstradayBars(
    {
      instrument_ids: primaryInstrumentIds,
      interval: 15,
    },
    {
      query: {
        placeholderData: keepPreviousData,
        enabled: !!primaryInstrumentIds.length,
        refetchOnWindowFocus: false,
      },
    }
  );

  return {
    intradayBarsData: intradayBarsData as IntradayBar[],
    isLoadingIntradayBars,
    isPlaceholderDataIntradayBars,
    primaryInstrumentIds,
  };
};
