import { Filters } from "@/typings/Filters";
import { MetricRequest } from "@api/types";

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
