import { keepPreviousData } from "@tanstack/react-query";
import {
  CompanyCatalogRequestFilters,
  CompanyFilterField,
  CompanyListRequest,
  CompanyLogicalFilterFiltersItem,
  ComparisonOperator,
  LogicalOperator,
} from "@api/types";
import { useListCompaniesV2 } from "@hooks/api/useListCompaniesV2";
import { Filters } from "@/typings/Filters";
import { mapFiltersToCompanyFilters } from "../helpers/filters";

export interface UseCoverageUniverseOptions {
  defaultFilter: CompanyCatalogRequestFilters[];
  sharedFilters: Filters;
  searchQuery: string;
  includes: string[];
  invalidate_cache?: boolean;
}

export const useCoverageUniverse = ({
  defaultFilter,
  sharedFilters,
  searchQuery,
  includes,
  invalidate_cache = false,
  ...params
}: UseCoverageUniverseOptions & CompanyListRequest) => {
  const defaultFilters = (
    defaultFilter && defaultFilter.length > 0
      ? defaultFilter.filter(Boolean)
      : []
  ) as CompanyLogicalFilterFiltersItem[];

  return useListCompaniesV2(
    {
      ...params,
      includes,
      filter: {
        op: LogicalOperator.and,
        filters: [
          ...defaultFilters,
          ...(sharedFilters ? mapFiltersToCompanyFilters(sharedFilters) : []),
          ...(searchQuery
            ? [
                {
                  op: LogicalOperator.or,
                  filters: [
                    {
                      field: CompanyFilterField.name,
                      op: ComparisonOperator.icontains,
                      value: searchQuery,
                    },
                    {
                      field: CompanyFilterField.primary_instrumentticker,
                      op: ComparisonOperator.icontains,
                      value: searchQuery,
                    },
                    {
                      field:
                        CompanyFilterField.primary_instrumentbbg_yellow_key,
                      op: ComparisonOperator.icontains,
                      value: searchQuery,
                    },
                  ],
                },
              ]
            : []),
        ],
      },
    },
    {
      query: {
        placeholderData: keepPreviousData,
      },
      request: {
        params: {
          invalidate_cache,
        },
      },
    }
  );
};
