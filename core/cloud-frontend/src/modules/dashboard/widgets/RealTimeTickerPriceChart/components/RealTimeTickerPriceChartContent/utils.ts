import { CompanyResponse } from "@/api/types/companyResponse";
import { PaginatedCompanyResponse } from "@/api/types/paginatedCompanyResponse";
import { IMetricChartDataItem } from "@/utils/charts";
import { Time, UTCTimestamp } from "lightweight-charts";
import { getUnixTime } from "date-fns";
import { DateRange } from "./constants";

interface IMarketPriceHistoryItem {
  date: string;
  market_price: number;
}

interface ICompanyItem {
  name: string;
  [key: string]: IMarketPriceHistoryItem[] | string;
}

export interface ICompanyData {
  items: ICompanyItem[];
}

export type IntradayBar = {
  instrument_id: number;
  instrument_bars: { timestamp: string; price: number }[];
};

type ServerPriceData = Record<
  number,
  { instrument_id: number; price: number; timestamp: string }[]
>;

const convertTimestampToChartTime = (timestamp: string): Time => {
  const unixTimestamp = getUnixTime(new Date(timestamp));

  return unixTimestamp as UTCTimestamp;
};

const buildHistoricalChartData = ({
  companyItem,
  metric,
}: {
  companyItem: CompanyResponse;
  metric: string;
}) => {
  if (!Array.isArray(companyItem[metric as keyof typeof companyItem]))
    return [];

  return (
    (
      companyItem[
        metric as keyof typeof companyItem
      ] as IMarketPriceHistoryItem[]
    )
      ?.map((historyItem: IMarketPriceHistoryItem) => ({
        time: historyItem.date,
        value: historyItem.market_price,
      }))
      .filter(Boolean) || []
  );
};

const buildIntradayChartData = ({
  companyItem,
  intradayBarsData,
}: {
  companyItem: CompanyResponse;
  intradayBarsData: IntradayBar[];
}) => {
  const matchingBar = intradayBarsData.find(
    (bar) => bar.instrument_id === companyItem.primary_instrument?.id
  );
  return (
    matchingBar?.instrument_bars?.map((bar) => ({
      time: convertTimestampToChartTime(bar.timestamp),
      value: bar.price,
    })) || []
  );
};

const buildRealTimePriceData = ({
  companyItem,
  realtimePriceData,
}: {
  companyItem: CompanyResponse;
  realtimePriceData?: ServerPriceData;
}) => {
  const instrumentId = companyItem.primary_instrument?.id;
  if (!instrumentId || !realtimePriceData?.[instrumentId]) return [];

  return realtimePriceData[instrumentId].map(
    (dataPoint: {
      instrument_id: number;
      price: number;
      timestamp: string;
    }) => ({
      time: convertTimestampToChartTime(dataPoint.timestamp),
      value: dataPoint.price,
    })
  );
};

const buildChartDataForDateRange = ({
  dateRange,
  companyItem,
  metric,
  intradayBarsData,
  realtimePriceData,
}: {
  dateRange: DateRange;
  companyItem: CompanyResponse;
  metric: string;
  intradayBarsData: IntradayBar[];
  realtimePriceData?: ServerPriceData;
}) => {
  switch (dateRange) {
    case "DTD":
      return [
        ...buildIntradayChartData({ companyItem, intradayBarsData }),
        ...buildRealTimePriceData({ companyItem, realtimePriceData }),
      ];
    case "MTD":
    case "QTD":
    case "YTD":
      return buildHistoricalChartData({ companyItem, metric });
    default:
      return [];
  }
};

export const mapCompanyDataToChartData = ({
  companiesData,
  metric,
  intradayBarsData,
  realtimePriceData,
  dateRange,
}: {
  companiesData: PaginatedCompanyResponse | undefined;
  metric: string;
  intradayBarsData: IntradayBar[];
  realtimePriceData?: Record<
    number,
    { instrument_id: number; price: number; timestamp: string }[]
  >;
  dateRange: DateRange;
}): IMetricChartDataItem[] => {
  if (!companiesData?.items) return [];

  return (
    companiesData.items
      ?.map((item: CompanyResponse) => ({
        name: item.name,
        value: item.name,
        id: item.id,
        data: buildChartDataForDateRange({
          dateRange,
          companyItem: item,
          metric,
          intradayBarsData,
          realtimePriceData,
        }),
      }))
      .filter((item) => item.data && item.data.length > 0) || []
  );
};
