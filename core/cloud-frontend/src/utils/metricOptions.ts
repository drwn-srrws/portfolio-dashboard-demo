interface MetricCatalogItem {
  name: string;
  display_name: string;
  description?: string;
}

export const createMetricOptions = (
  metrics: string[],
  catalog: MetricCatalogItem[]
): { label: string; value: string }[] => {
  return metrics.map((metric) => ({
    label: catalog.find((m) => m.name === metric)?.display_name || metric,
    value: metric,
  }));
};

export const transformCatalogToOptions = (
  catalog: MetricCatalogItem[]
): { label: string; value: string; tooltip?: string }[] => {
  return catalog.map((metric) => ({
    label: metric.display_name,
    value: metric.name,
    tooltip: metric.description,
  }));
};
