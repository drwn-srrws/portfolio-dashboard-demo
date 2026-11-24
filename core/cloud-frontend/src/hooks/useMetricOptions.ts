import { useMemo } from "react";

import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { MetricMetadata } from "@api/types/index";
import { getFilterOptions } from "@/components/FilterController/utils";

export const useMetricOptions = () => {
  const { data: metricCatalogData } = useGetPortfolioMetricCatalogV3({
    include_filterable_values: true,
  });

  const metricCatalog = useMemo(
    () => metricCatalogData?.metrics || [],
    [metricCatalogData]
  );

  const metricOptions = useMemo(
    () =>
      metricCatalog.map((metric) => ({
        value: metric.name,
        label: metric.display_name,
        tooltip: metric.description,
      })),
    [metricCatalog]
  );

  const filterOptions = useMemo(
    () => getFilterOptions(metricCatalogData as MetricMetadata),
    [metricCatalogData]
  );

  return { metricOptions, filterOptions };
};
