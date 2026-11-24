import { IMetricCard } from "@/components/MetricCard";

export const JUNK_METRICS = ["primary_analyst"];

export const filterJunkMetrics = (
  metrics: IMetricCard[],
  filterKeys: string[]
) => {
  return metrics.filter((metric) => !filterKeys.includes(metric.name));
};
