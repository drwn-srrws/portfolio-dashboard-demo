import { useReadEvent } from "@/api/endpoints/event/event";
import { useReadCompanyPrice } from "@/api/endpoints/market-data/market-data";

export const useEventForPrice = (eventId: number | null, enabled = true) => {
  const {
    data: eventData,
    isLoading: isEventLoading,
    error: eventError,
  } = useReadEvent(eventId!, {
    query: {
      enabled: enabled && eventId != null,
    },
  });

  const {
    data: marketData,
    isLoading: isPriceLoading,
    error: priceError,
  } = useReadCompanyPrice(eventData?.company_id || 0, {
    query: {
      refetchInterval: 60 * 10 * 1000,
      enabled: enabled && !!eventData?.company_id,
    },
  });

  return {
    marketData,
    eventData,
    isLoading: isEventLoading || isPriceLoading,
    error: eventError || priceError,
  };
};
