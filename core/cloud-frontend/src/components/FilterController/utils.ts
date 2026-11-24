import { omit } from "ramda";

import { MetricMetadata, MetricCatalogItem } from "@api/types/index";
import { Selectable } from "@typings/Selectable";
import { Filters } from "@/typings/Filters";

const excludeFilters = ["in_portfolio"];

export const mapFilterOptionsToSelectOptions = (
  filterOptions: MetricCatalogItem[]
) => {
  return filterOptions
    .map((metric) => ({
      name: metric.name,
      label: metric.display_name,
      options: (metric.filterable_values || [])?.map((value) => ({
        value: value as Selectable["value"],
        label: value as Selectable["label"],
      })),
    }))
    .filter((option) => !excludeFilters.includes(option.name));
};

export const getDefaultFilters = (
  defaultFilters: string[],
  filterOptions: MetricCatalogItem[]
): { [key: string]: string[] } => {
  return defaultFilters.reduce(
    (acc: { [key: string]: string[] }, defaultFilterItem) => {
      const filterOption = filterOptions.find(
        (filterOption) => filterOption.name === defaultFilterItem
      );
      if (filterOption) {
        acc[filterOption.name] = filterOption.filterable_values as string[];
      }
      return acc;
    },
    {}
  );
};

export const getFilterOptions = (
  metricsCatalogData: MetricMetadata,
  allowedFiltersOptions?: string[]
) => {
  return (
    metricsCatalogData?.filterable_by?.filter(
      (option) =>
        !allowedFiltersOptions || allowedFiltersOptions.includes(option.name)
    ) || []
  );
};

export const getDefaultFilterMap = (defaultFilters: string[]) => {
  return defaultFilters.reduce(
    (acc, filter) => {
      acc[filter] = [];
      return acc;
    },
    {} as Record<string, string[]>
  );
};

export const getGroupByOptions = (
  metricsCatalogData: MetricMetadata
): MetricCatalogItem[] => {
  return metricsCatalogData?.groupable_by || [];
};

const findMissingOptions = (
  values: Selectable["value"][],
  options: Selectable[]
) =>
  values
    .filter(
      (value) =>
        !options.some((option) => option.value.toString() === value.toString())
    )
    .map((value) => ({
      value,
      label: String(value),
      deprecated: true,
    }));

export const getFiltersWithDeprecatedOptions = (
  filters: {
    name: string;
    label: string;
    options: Selectable[];
  }[],
  selectedFilters: Filters
) => {
  return filters.map((filter) => {
    const selectedValues = selectedFilters[filter.name] || [];
    const missingOptions = findMissingOptions(selectedValues, filter.options);

    return missingOptions.length > 0
      ? {
          ...filter,
          options: [...filter.options, ...missingOptions],
        }
      : filter;
  });
};

export const processFilterFieldsWithDeprecated = (
  filterOptions?: MetricCatalogItem[],
  selectedFilters?: Filters
) => {
  const filterableByKeys = filterOptions?.map((item) => item.name) || [];

  const selectedFiltersKeys = Object.keys(selectedFilters || {});

  const orderedKeys = selectedFiltersKeys.filter((key) =>
    filterableByKeys.includes(key)
  );

  const existingFilters = Object.fromEntries(
    orderedKeys.map((key) => [key, (selectedFilters || {})[key] || []])
  ) as Record<string, string[]>;

  const missingFilters = omit(
    filterableByKeys,
    selectedFilters || {}
  ) as Record<string, string[]>;

  const existingFiltersFields = Object.keys(existingFilters);
  const missingFiltersFields = Object.keys(missingFilters);

  return {
    existingFilters,
    missingFilters,
    existingFiltersFields,
    missingFiltersFields,
  };
};
