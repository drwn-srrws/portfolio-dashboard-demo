import { CompanyCatalogMetadata, MetricCatalogItem } from "@/api/types";

export const STATS_METRICS = [
  "number_of_companies",
  "portfolio_coverage_count",
  "portfolio_coverage_market_cap",
  "capture_rate",
];

export type StatsMetricName = (typeof STATS_METRICS)[number];

export const convertCatalogToMetrics = (
  catalogData: CompanyCatalogMetadata | undefined
): MetricCatalogItem[] => {
  if (!catalogData?.fields) return [];

  return catalogData.fields
    .filter((field) => field.name.startsWith("stats."))
    .map((field) => ({
      name: field.name.replace("stats.", ""),
      display_name: field.display_name,
      display_type: field.display_type,
      description: field.description,
    })) as MetricCatalogItem[];
};
