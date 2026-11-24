import { useMemo } from "react";
import { Selectable } from "@/typings/Selectable";
import { CompanyCatalogRequestFilters } from "@/api/types/companyCatalogRequestFilters";
import { Filters } from "@/typings/Filters";
import { useCompanyCatalog } from "@/modules/dashboard/widgets/CoverageUniverse/hooks/useCompanyCatalog";
import { getFilterOptions } from "../../CoverageUniverse/helpers/getFilterOptions";
import { useSelectedCompaniesData } from "./useSelectedCompaniesData";
import { useGetInstradayBars } from "@/api/endpoints/instrument/instrument";
import {
  DateRange,
  mapDateRangeToMetric,
} from "../components/RealTimeTickerPriceChartContent/constants";
import { keepPreviousData } from "@tanstack/react-query";
import { IntradayBar } from "../components/RealTimeTickerPriceChartContent/utils";

export const useChartCompanies = ({
  defaultFilters,
  sharedFilters,
  selectedDateRange,
  selectedCompanies,
}: {
  defaultFilters: CompanyCatalogRequestFilters[];
  sharedFilters: Filters;
  selectedDateRange: DateRange;
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
    includes:
      selectedDateRange === "DTD"
        ? ["primary_instrument"]
        : [mapDateRangeToMetric(selectedDateRange)],
    page: 1,
    page_size: selectedCompanies.length,
    sort_by: "name",
    sort_order: "asc",
    refetchOnWindowFocus: false,
  });

  const primaryInstrumentIds = useMemo(() => {
    return (
      companiesData?.items
        ?.map((company) => company.primary_instrument?.id)
        .filter((id): id is number => Boolean(id)) || []
    );
  }, [companiesData]);

  const {
    data: intradayBarsData,
    isLoading: isLoadingIntradayBars,
    isPlaceholderData: isPlaceholderDataIntradayBars,
  } = useGetInstradayBars(
    {
      instrument_ids: primaryInstrumentIds,
      interval: 15,
    },
    {
      query: {
        placeholderData: keepPreviousData,
        enabled: !!primaryInstrumentIds.length && selectedDateRange === "DTD",
        refetchOnWindowFocus: false,
      },
    }
  );

  const filterOptions = useMemo(() => {
    return getFilterOptions(companyCatalogDataWithFilters);
  }, [companyCatalogDataWithFilters]);

  const isLoadingCompanyData = useMemo(
    () =>
      isLoadingCoverageUniverse ||
      (selectedDateRange === "DTD" && isLoadingIntradayBars),
    [isLoadingCoverageUniverse, isLoadingIntradayBars, selectedDateRange]
  );

  const isLoadingCatalogData = useMemo(
    () => isLoadingCompanyCatalogWithFilters,
    [isLoadingCompanyCatalogWithFilters]
  );

  const isPlaceholderData = useMemo(() => {
    return (
      isPlaceholderDataCoverageUniverse ||
      (selectedDateRange === "DTD" && isPlaceholderDataIntradayBars)
    );
  }, [
    isPlaceholderDataCoverageUniverse,
    isPlaceholderDataIntradayBars,
    selectedDateRange,
  ]);

  return {
    filterOptions,
    companiesData,
    intradayBarsData: intradayBarsData as IntradayBar[],
    isLoadingCompanyData,
    isLoadingCatalogData,
    isPlaceholderData,
  };
};
