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
import { Selectable } from "@/typings/Selectable";
import { mapFiltersToCompanyFilters } from "../../CoverageUniverse/helpers/filters";

export interface UseCoverageUniverseOptions {
  defaultFilter: CompanyCatalogRequestFilters[];
  sharedFilters: Filters;
  searchQuery: string;
  includes: string[];
  selectedCompanies: Selectable[];
  refetchOnWindowFocus?: boolean;
  enabled?: boolean;
}

export const useSelectedCompaniesData = ({
  defaultFilter,
  sharedFilters,
  searchQuery,
  includes,
  selectedCompanies,
  refetchOnWindowFocus = true,
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
          ...(selectedCompanies.length > 0
            ? [
                {
                  op: LogicalOperator.or,
                  filters: selectedCompanies.map((company) => ({
                    field: "id" as const,
                    op: "eq" as const,
                    value: Number(company.value),
                  })),
                },
              ]
            : []),
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
        enabled: selectedCompanies.length > 0,
        refetchOnWindowFocus: refetchOnWindowFocus,
      },
    }
  );
};
