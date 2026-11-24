import {
  MetricResult,
  MetricCatalogItem,
  MetricDisplayType,
} from "@api/types/index";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";

export const mapMetricsValuesToCards = (
  defaultMetrics: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metricsValues: any["metrics"],
  metricsCatalog: MetricCatalogItem[]
) => {
  return Object.keys(metricsValues)
    .sort((a, b) => defaultMetrics.indexOf(a) - defaultMetrics.indexOf(b))
    .map((key) => {
      const metric = metricsCatalog.find((metric) => metric.name === key);
      const displayName = String(metric?.display_name || metric?.name);
      const name = String(metric?.name);

      const value = metric?.display_type
        ? formatMetric(metricsValues[key], metric?.display_type)
        : String(metricsValues[key]);

      const status = getValueStatusForMetric({
        value: metricsValues[key],
        direction: displayName,
        metric: {
          display_type: metric?.display_type as MetricDisplayType,
        },
      });

      return {
        name,
        displayName,
        value,
        status,
        description: metric?.description,
      };
    });
};

export const mapToMetricsValues = (metrics: Array<MetricResult>) =>
  metrics?.[0]?.data?.[0] || {};
