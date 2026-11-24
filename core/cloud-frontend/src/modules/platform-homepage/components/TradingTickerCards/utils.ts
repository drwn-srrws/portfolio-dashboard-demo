import { numToDollar } from "@/utils/currency";
import { PaginatedCompanyResponse } from "@/api/types";

export const formatTickerData = (data?: PaginatedCompanyResponse) => {
  if (!data) return [];

  return data.items?.map((item) => ({
    ...item,
    displayName: item.name,
    value: numToDollar(item.market_price?.price ?? 0),
    lastValue: numToDollar(item.last_price_bbg ?? 0),
  }));
};
