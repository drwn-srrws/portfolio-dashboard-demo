import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { TradingTickerCard } from "./components/TradingTickerCard";
import { keepPreviousData } from "@tanstack/react-query";
import { useListCompaniesV2 } from "@/api/endpoints/company/company";
import { useMemo } from "react";
import { formatTickerData } from "./utils";
import { Skeleton } from "@/components/ui/skeleton";
import styles from "./styles.module.css";
import { numToDollar } from "@/utils/currency";
import { useInstrumentSocket } from "@/hooks/useInstrumentSocket";

const TradingTickerCardsContent = () => {
  const { data, isLoading } = useListCompaniesV2(
    {
      page: 1,
      page_size: 50,
      includes: ["market_price", "ytd_return"],
    },
    undefined,
    {
      query: {
        placeholderData: keepPreviousData,
      },
    }
  );

  const formattedData = useMemo(() => formatTickerData(data), [data]);
  const primaryInstrumentIds = useMemo(
    () =>
      formattedData
        ?.map((item) => item.primary_instrument?.id)
        .filter((id): id is number => Boolean(id)) || [],
    [formattedData]
  );
  const { serverData } = useInstrumentSocket({
    url: "/api/dev/instrument/get-realtime-ticks",
    instrumentIds: primaryInstrumentIds,
  });

  const companyWithRealtimePrice = useMemo(() => {
    return formattedData?.map((item) => {
      const instrumentId = item.primary_instrument?.id;
      if (!instrumentId || !serverData[instrumentId]) return item;

      const realtimePrice =
        serverData[instrumentId]?.[serverData[instrumentId].length - 1]?.price;

      return {
        ...item,
        value: realtimePrice ? numToDollar(realtimePrice) : null,
      };
    });
  }, [formattedData, serverData]);

  return (
    <div className="flex h-fit w-full gap-3">
      <div className={styles.tickerContainer}>
        <div className={styles.tickerWrapper}>
          {isLoading
            ? Array.from({ length: 50 }).map((_: unknown, index: number) => (
                <div className="flex-shrink-0" key={index}>
                  <div className="flex flex-col border-2 w-auto rounded-3xl p-4 gap-2 items-center justify-between min-w-[155px] border-neutral-800 max-h-[98%]">
                    <Skeleton className="h-6 w-24" />
                    <div className="flex items-center gap-6">
                      <Skeleton className="h-7 w-16" />
                      <Skeleton className="h-[18px] w-12 rounded-sm" />
                    </div>
                  </div>
                </div>
              ))
            : companyWithRealtimePrice?.map((item) => (
                <div className="flex-shrink-0" key={`${item.name}-1`}>
                  <TradingTickerCard {...item} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export const TradingTickerCards = withAppInsights(
  TradingTickerCardsContent,
  "TradingTickerCards"
);
