import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { mapFiltersToCompanyFilters } from "../../CoverageUniverse/helpers/filters";
import { useListCompaniesV2 } from "@/hooks/api/useListCompaniesV2";
import { CompanySort } from "@/api/types/companySort";
import { LogicalOperator } from "@/api/types/logicalOperator";
import { CompanyCatalogRequestFilters } from "@/api/types/companyCatalogRequestFilters";
import { Filters } from "@/typings/Filters";
import { useReadCompany } from "@/api/endpoints/company/company";

export const useDefaultChartCompanies = ({
  defaultFilters,
  sharedFilters,
  sortByMetric,
}: {
  defaultFilters: CompanyCatalogRequestFilters[];
  sharedFilters: Filters;
  sortByMetric: CompanySort;
}) => {
  const { companyId } = useParams();

  const { data: company, isLoading: isLoadingDefaultCompany } = useReadCompany(
    Number(companyId),
    {
      query: {
        enabled: !!companyId,
      },
    }
  );

  const { data: defaultCompanies, isLoading: isLoadingDefaultCompanies } =
    useListCompaniesV2(
      {
        page: 1,
        page_size: 10,
        sort_by: sortByMetric,
        sort_order: "desc",

        filter: {
          op: LogicalOperator.and,
          filters: [
            ...defaultFilters,
            ...(sharedFilters ? mapFiltersToCompanyFilters(sharedFilters) : []),
          ].filter(
            (filter): filter is NonNullable<typeof filter> => filter !== null
          ),
        },
      },
      {
        query: {
          enabled: !companyId,
        },
      }
    );

  const defaultCompaniesData = useMemo(() => {
    if (companyId) {
      return [{ id: companyId, name: company?.display_name }];
    }
    if (defaultCompanies?.items) {
      return defaultCompanies.items;
    }
    return [];
  }, [companyId, company, defaultCompanies]);

  const isLoadingDefaultCompaniesData = useMemo(() => {
    return isLoadingDefaultCompany || isLoadingDefaultCompanies;
  }, [isLoadingDefaultCompany, isLoadingDefaultCompanies]);

  return {
    defaultCompanies: defaultCompaniesData,
    isLoadingDefaultCompanies: isLoadingDefaultCompaniesData,
  };
};
