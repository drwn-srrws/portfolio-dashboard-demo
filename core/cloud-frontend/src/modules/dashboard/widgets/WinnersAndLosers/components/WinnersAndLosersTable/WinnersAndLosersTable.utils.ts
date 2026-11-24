import { Filters } from "@/typings/Filters";
import { MetricRequest } from "@api/types/index";

type WinnersAndLosersData = {
  [key: string]: unknown;
};

export const getWinnersList = (
  data: WinnersAndLosersData[],
  quantity: number | "all",
  sortByMetric: string
) =>
  data
    .filter((data) => Number(data[sortByMetric]) >= 0)
    .sort((a, b) => Number(b[sortByMetric]) - Number(a[sortByMetric]))
    .slice(0, quantity === "all" ? undefined : quantity);

export const getLosersList = (
  data: WinnersAndLosersData[],
  quantity: number | "all",
  sortByMetric: string
) =>
  data
    .filter((data) => Number(data[sortByMetric]) < 0)
    .sort((a, b) => Number(a[sortByMetric]) - Number(b[sortByMetric]))
    .slice(0, quantity === "all" ? undefined : quantity);

interface ICreateMetricRequest {
  startDate?: string;
  endDate?: string;
  metricsCatalog: { name: string }[];
  filters: Filters;
  groupBy: string[];
}

export const createMetricRequest = ({
  startDate,
  endDate,
  metricsCatalog,
  filters,
  groupBy,
}: ICreateMetricRequest): MetricRequest => {
  return {
    start_date: startDate,
    end_date: endDate,
    metrics: metricsCatalog.map((option) => ({ name: option.name })),
    group_by: groupBy,
    filters: filters,
  };
};

export const getDataPath = (data: { uniqueIds: string[] }) => data.uniqueIds;

export const getRowId = (data: { uniqueIds: string[] }) =>
  data.uniqueIds.join("-");

export const DATE_RANGE_OPTIONS = [
  { value: "T1D", label: "DTD" },
  { value: "WTD", label: "WTD" },
  { value: "MTD", label: "MTD" },
  { value: "QTD", label: "QTD" },
  { value: "YTD", label: "YTD" },
];
