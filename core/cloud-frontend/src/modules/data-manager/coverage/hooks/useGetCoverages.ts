import {
  useReadCompanies,
  useReadCompanyCoverages,
} from "@api/endpoints/company/company";
import { useGetUsers } from "@api/endpoints/user/user";
import {
  CoverageType,
  LegacyCompanyResponse,
  UserResponse,
} from "@api/types/index";
import { parseDateString } from "@/utils/index";
import { useMemo } from "react";
import { subtractOneDay } from "../helpers/convertCoverageRowToModel";

export type CoverageRow = {
  id: number;
  company: LegacyCompanyResponse;
  primary_analyst: UserResponse;
  coverage_type: CoverageType;
  effective_start_date: Date;
  effective_end_date?: Date;
};

export const useGetCoverages = () => {
  const { data: users = [], isLoading: isLoadingUsers } = useGetUsers();
  const { data: companies = [], isLoading: isLoadingCompanies } =
    useReadCompanies();
  const { data: coverages = [], isLoading: isLoadingCoverages } =
    useReadCompanyCoverages();

  const uniqueCompanies = new Map<string, LegacyCompanyResponse>();

  for (const company of companies) {
    if (company.display_name) {
      uniqueCompanies.set(company.display_name, company);
    }
  }

  const uniqueCompaniesArray = Array.from(uniqueCompanies.values());

  const rows = useMemo(
    () =>
      coverages
        .map((coverage) => {
          const company = companies.find((c) => c.id === coverage.company_id);
          const user = users.find((u) => u.id === coverage.user_id);

          if (!company || !user) {
            return null;
          }

          const parsedEndDate = parseDateString(
            coverage?.effective_end_date as string
          );

          return {
            ...coverage,
            company,
            primary_analyst: user,
            coverage_type: coverage.coverage_type!,
            effective_start_date: parseDateString(
              coverage.effective_start_date
            )!,
            effective_end_date: parsedEndDate
              ? subtractOneDay(parsedEndDate)
              : undefined,
          } as CoverageRow;
        })
        .filter(Boolean) as CoverageRow[],
    [coverages, companies, users]
  );

  const isLoading = isLoadingUsers || isLoadingCompanies || isLoadingCoverages;

  return {
    rows,
    companies: uniqueCompaniesArray,
    users,
    isLoading,
  };
};
