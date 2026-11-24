import { CompanyResponse } from "@/api/types/companyResponse";
import { PaginatedCompanyResponse } from "@/api/types/paginatedCompanyResponse";
import { IMetricChartDataItem } from "@/utils/charts";

interface IHistoryItem {
  date: string;
  market_price?: number;
  enterprise_value?: number;
  market_cap?: number;
}

interface ICompanyItem {
  name: string;
  [key: string]: IHistoryItem[] | string;
}

export interface ICompanyData {
  items: ICompanyItem[];
}

const getValueFromHistoryItem = (
  historyItem: IHistoryItem,
  metric: string
): number => {
  if (metric.includes("market_price")) {
    return historyItem.market_price || 0;
  } else if (metric.includes("enterprise_value")) {
    return historyItem.enterprise_value || 0;
  } else if (metric.includes("market_cap")) {
    return historyItem.market_cap || 0;
  }
  return historyItem.market_price || 0;
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
    (companyItem[metric as keyof typeof companyItem] as IHistoryItem[])
      ?.map((historyItem: IHistoryItem) => ({
        time: historyItem.date,
        value: getValueFromHistoryItem(historyItem, metric),
      }))
      .filter(Boolean) || []
  );
};

export const mapCompanyDataToChartData = ({
  companiesData,
  metric,
}: {
  companiesData: PaginatedCompanyResponse | undefined;
  metric: string;
}): IMetricChartDataItem[] => {
  if (!companiesData?.items) return [];

  return (
    companiesData.items
      ?.map((item: CompanyResponse) => ({
        name: item.name,
        value: item.name,
        id: item.id,
        data: buildHistoricalChartData({ companyItem: item, metric }),
      }))
      .filter((item) => item.data && item.data.length > 0) || []
  );
};
