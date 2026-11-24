import { useMemo } from "react";
import FilterController from "@components/FilterController/FilterController";
import { useFilters } from "@providers/FiltersProvider/FiltersContext";
import { useRetrieveCompanyCatalog } from "@/api/endpoints/company/company";
import { useConfig } from "@/providers/ConfigProvider/useConfig";
import { getFilterOptions } from "@/modules/dashboard/widgets/CoverageUniverse/helpers/getFilterOptions";
import { MetricDisplayType } from "@/api/types";

export interface CoverageUniverseFiltersProps {
  allowedFiltersOptions?: string[];
}

// Bucket presets for numeric fields whose raw catalog values aren't a small
// discrete set. The dropdown shows these labels; the label -> predicate
// mapping lives in mapFiltersToCompanyFilters (helpers/filters.ts). These
// replace the raw catalog entries of the same name.
const BUCKET_FILTER_OPTIONS = [
  {
    name: "market_cap_bbg",
    display_name: "Market Cap",
    filterable_values: ["S (≤1B)", "M (1B-5B)", "L (>5B)"],
    description: "Filter by market cap size bucket",
    display_type: MetricDisplayType.string,
  },
  {
    name: "pitchbook_profile.total_raised",
    display_name: "Total Raised",
    filterable_values: ["$50M-$100M", "$100M-$250M", ">$250M"],
    description: "Filter by total capital raised",
    display_type: MetricDisplayType.string,
  },
];

const BUCKET_FILTER_NAMES = new Set(
  BUCKET_FILTER_OPTIONS.map((option) => option.name)
);

export const CoverageUniverseFilters = ({
  allowedFiltersOptions,
}: CoverageUniverseFiltersProps) => {
  const { filters, setFilters } = useFilters();
  const frontendConfig = useConfig();

  const { data: companyCatalogData, isLoading: isLoadingCompanyCatalog } =
    useRetrieveCompanyCatalog(
      {
        filters:
          frontendConfig.pages?.coverageMonitor?.hiddenFilters || undefined,
      },
      {
        include_filterable_values: true,
      }
    );

  const filterOptions = useMemo(() => {
    const baseOptions = getFilterOptions(
      companyCatalogData,
      allowedFiltersOptions
    ).filter((option) => !BUCKET_FILTER_NAMES.has(option.name));

    // Only surface a bucket preset if it passed the allowlist (when one is set).
    const allowedBuckets = BUCKET_FILTER_OPTIONS.filter(
      (option) =>
        !allowedFiltersOptions || allowedFiltersOptions.includes(option.name)
    );

    return [...baseOptions, ...allowedBuckets];
  }, [allowedFiltersOptions, companyCatalogData]);

  return (
    <FilterController
      className="w-full"
      filterOptions={filterOptions}
      selectedFilters={filters}
      setSelectedFilters={setFilters}
      isLoadingMetricsCatalog={isLoadingCompanyCatalog}
      testId="coverage-universe-toolbar-filter-controller"
    />
  );
};
