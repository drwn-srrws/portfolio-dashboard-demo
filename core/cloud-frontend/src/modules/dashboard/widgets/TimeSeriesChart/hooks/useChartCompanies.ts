import { useMemo } from "react";
import { Selectable } from "@/typings/Selectable";
import { CompanyCatalogRequestFilters } from "@/api/types/companyCatalogRequestFilters";
import { Filters } from "@/typings/Filters";
import { useCompanyCatalog } from "@/modules/dashboard/widgets/CoverageUniverse/hooks/useCompanyCatalog";
import { getFilterOptions } from "../../CoverageUniverse/helpers/getFilterOptions";
import { useSelectedCompaniesData } from "./useSelectedCompaniesData";
import {
  DateRange,
  MetricType,
  mapDateRangeToMetric,
} from "../components/TimeSeriesChartContent/constants";
import { CompanyIncludes } from "@/api/types/companyIncludes";

export const useChartCompanies = ({
  defaultFilters,
  sharedFilters,
  selectedDateRange,
  selectedMetricType,
  selectedCompanies,
}: {
  defaultFilters: CompanyCatalogRequestFilters[];
  sharedFilters: Filters;
  selectedDateRange: DateRange;
  selectedMetricType: MetricType;
  selectedCompanies: Selectable[];
}) => {
  const {
    data: companyCatalogDataWithFilters,
    isLoading: isLoadingCompanyCatalogWithFilters,
  } = useCompanyCatalog(undefined, {
    include_filterable_values: true,
  });

  const {
    data: companiesData,
    isLoading: isLoadingCoverageUniverse,
    isPlaceholderData: isPlaceholderDataCoverageUniverse,
  } = useSelectedCompaniesData({
    selectedCompanies,
    defaultFilter: defaultFilters,
    sharedFilters: sharedFilters,
    searchQuery: "",
    includes: [
      mapDateRangeToMetric(
        selectedDateRange,
        selectedMetricType
      ) as CompanyIncludes,
    ],
    page: 1,
    page_size: selectedCompanies.length,
    sort_by: "name",
    sort_order: "asc",
    refetchOnWindowFocus: false,
  });

  const filterOptions = useMemo(() => {
    return getFilterOptions(companyCatalogDataWithFilters);
  }, [companyCatalogDataWithFilters]);

  const isLoadingCompanyData = useMemo(
    () => isLoadingCoverageUniverse,
    [isLoadingCoverageUniverse]
  );

  const isLoadingCatalogData = useMemo(
    () => isLoadingCompanyCatalogWithFilters,
    [isLoadingCompanyCatalogWithFilters]
  );

  const isPlaceholderData = useMemo(() => {
    return isPlaceholderDataCoverageUniverse;
  }, [isPlaceholderDataCoverageUniverse]);

  return {
    filterOptions,
    companiesData,
    isLoadingCompanyData,
    isLoadingCatalogData,
    isPlaceholderData,
  };
};
