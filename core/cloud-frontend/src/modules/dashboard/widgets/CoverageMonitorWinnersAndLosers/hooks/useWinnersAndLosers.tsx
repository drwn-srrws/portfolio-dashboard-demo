import {
  CompanyCatalogRequestFilters,
  CompanyIncludes,
  CompanySort,
} from "@/api/types";
import { useListCompaniesV2 } from "@/hooks/api/useListCompaniesV2";
import { useMemo } from "react";

export type WinnersAndLosersRow = {
  id: string;
  name: string;
  [key: string]: string | number;
};

export interface UseWinnersAndLosersOptions {
  selection: { top: string };
  startDate?: string;
  endDate?: string;
  sortByMetric: string;
  filter: CompanyCatalogRequestFilters;
}

const defaultIncludes = ["ytd_percent_return_bbg"] as CompanyIncludes[];

export const useWinnersAndLosers = ({
  selection,
  sortByMetric,
  filter,
}: UseWinnersAndLosersOptions) => {
  const { data: winners, isLoading: isLoadingWinners } = useListCompaniesV2({
    page: 1,
    page_size: Number(selection.top),
    sort_by: "ytd_percent_return_bbg" as CompanySort,
    sort_order: "desc",
    includes: defaultIncludes,
    filter,
  });

  const { data: losers, isLoading: isLoadingLosers } = useListCompaniesV2({
    page: 1,
    page_size: Number(selection.top),
    sort_by: "ytd_percent_return_bbg" as CompanySort,
    sort_order: "asc",
    includes: defaultIncludes,
    filter,
  });

  const winnersRows = useMemo(
    () =>
      winners?.items.map((company) => ({
        id: String(company.id),
        name: company.name,
        [sortByMetric]:
          (company[sortByMetric as keyof typeof company] as string | number) ??
          0,
      })) ?? [],
    [winners?.items, sortByMetric]
  );

  const losersRows = useMemo(
    () =>
      losers?.items.map((company) => ({
        id: String(company.id),
        name: company.name,
        [sortByMetric]:
          (company[sortByMetric as keyof typeof company] as string | number) ??
          0,
      })) ?? [],
    [losers?.items, sortByMetric]
  );

  return {
    winnersRows,
    losersRows,
    isLoadingWinners,
    isLoadingLosers,
  };
};
