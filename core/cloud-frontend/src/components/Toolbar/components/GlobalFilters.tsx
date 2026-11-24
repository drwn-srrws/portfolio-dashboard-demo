import { useMemo } from "react";
import FilterController from "@components/FilterController/FilterController";
import { getFilterOptions } from "@components/FilterController/utils";
import { useMetricFlags } from "@providers/MetricFlagsProvider";
import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { useFilters } from "@providers/FiltersProvider/FiltersContext";

export interface GlobalFiltersProps {
  allowedFiltersOptions?: string[];
}

export const GlobalFilters = ({
  allowedFiltersOptions,
}: GlobalFiltersProps) => {
  const { metricFlags } = useMetricFlags();
  const { filters, setFilters } = useFilters();

  const catalogQueryFlags = {
    ...metricFlags,
    include_filterable_values: true,
  };

  const { data: metricsCatalogDataV3, isLoading: isLoadingMetricsCatalogV3 } =
    useGetPortfolioMetricCatalogV3(catalogQueryFlags);

  const filterOptions = useMemo(() => {
    if (!metricsCatalogDataV3) return [];
    return getFilterOptions(metricsCatalogDataV3, allowedFiltersOptions);
  }, [allowedFiltersOptions, metricsCatalogDataV3]);

  return (
    <FilterController
      className="w-full"
      filterOptions={filterOptions}
      selectedFilters={filters}
      setSelectedFilters={setFilters}
      isLoadingMetricsCatalog={isLoadingMetricsCatalogV3}
    />
  );
};
