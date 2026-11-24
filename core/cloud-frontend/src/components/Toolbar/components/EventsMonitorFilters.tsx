import { useMemo } from "react";
import FilterController from "@components/FilterController/FilterController";
import { useFilters } from "@providers/FiltersProvider/FiltersContext";
import { getFilterOptions } from "@/modules/dashboard/widgets/CoverageUniverse/helpers/getFilterOptions";
import { useRetrieveEventTrackerCatalog } from "@/api/endpoints/event-tracker/event-tracker";
import { MetricDisplayType } from "@/api/types";

export interface EventsMonitorFiltersProps {
  allowedFiltersOptions?: string[];
}

export const EventsMonitorFilters = ({
  allowedFiltersOptions,
}: EventsMonitorFiltersProps) => {
  const { filters, setFilters } = useFilters();

  const {
    data: eventTrackerCatalogData,
    isLoading: isLoadingEventTrackerCatalog,
  } = useRetrieveEventTrackerCatalog(
    {},
    {
      include_filterable_values: true,
    }
  );

  const filterOptions = useMemo(() => {
    const baseOptions = getFilterOptions(
      eventTrackerCatalogData,
      allowedFiltersOptions
    );
    const customPositionSizeFilter = {
      name: "position_size",
      display_name: "Position Size",
      filterable_values: ["<=100 bps", ">100 bps"],
      description: "Filter by position size",
      display_type: MetricDisplayType.string,
    };

    const filteredOptions = baseOptions.filter(
      (option) => option.name !== "position_size"
    );

    return [...filteredOptions, customPositionSizeFilter];
  }, [allowedFiltersOptions, eventTrackerCatalogData]);

  return (
    <FilterController
      className="w-full"
      filterOptions={filterOptions}
      selectedFilters={filters}
      setSelectedFilters={setFilters}
      isLoadingMetricsCatalog={isLoadingEventTrackerCatalog}
      testId="events-monitor-toolbar-filter-controller"
    />
  );
};
