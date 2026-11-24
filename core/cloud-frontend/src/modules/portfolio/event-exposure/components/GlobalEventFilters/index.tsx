import { useGetEventMetricsCatalog } from "@/api/endpoints/event/event";
import FilterController from "@/components/FilterController/FilterController";
import { getFilterOptions } from "@/components/FilterController/utils";
import { useFilters } from "@/providers/FiltersProvider";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useMemo } from "react";

export interface GlobalEventFiltersProps {
  allowedFilterOptions?: string[];
}

export const GlobalEventFilters = ({
  allowedFilterOptions,
}: GlobalEventFiltersProps) => {
  const { filters, setFilters } = useFilters();
  const { metricFlags } = useMetricFlags();

  const {
    data: eventMetricsCatalogData,
    isLoading: isLoadingEventMetricsCatalog,
  } = useGetEventMetricsCatalog({
    explode_composites: true,
    ...metricFlags,
  });

  const filterOptions = useMemo(() => {
    if (!eventMetricsCatalogData) {
      return [];
    }
    return getFilterOptions(eventMetricsCatalogData, allowedFilterOptions);
  }, [allowedFilterOptions, eventMetricsCatalogData]);

  return (
    <FilterController
      testId="event-exposure-toolbar-filter-controller"
      className="w-full"
      filterOptions={filterOptions}
      selectedFilters={filters}
      setSelectedFilters={setFilters}
      isLoadingMetricsCatalog={isLoadingEventMetricsCatalog}
    />
  );
};
