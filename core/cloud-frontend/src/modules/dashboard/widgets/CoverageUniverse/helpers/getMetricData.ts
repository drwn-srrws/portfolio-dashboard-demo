import { MetricCatalogItem } from "@api/types";

export const getMetricData = (
  catalog: Array<MetricCatalogItem>,
  key: string
) => {
  const metric = catalog.find((metric) => metric.name === key);
  return metric;
};
