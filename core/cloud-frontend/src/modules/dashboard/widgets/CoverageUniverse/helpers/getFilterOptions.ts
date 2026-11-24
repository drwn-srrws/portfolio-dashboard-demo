import { CompanyCatalogMetadata, MetricCatalogItem } from "@/api/types";

export const getFilterOptions = (
  metricsCatalogData?: CompanyCatalogMetadata | null,
  allowedFiltersOptions?: string[]
) => {
  if (!metricsCatalogData) return [];

  return (metricsCatalogData?.filterable_by?.filter(
    (option) =>
      !allowedFiltersOptions || allowedFiltersOptions.includes(option.name)
  ) || []) as MetricCatalogItem[];
};
