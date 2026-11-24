import { useListCompaniesV2 } from "@/hooks/api/useListCompaniesV2";
import {
  CompanyCatalogRequestFilters,
  CompanyIncludes,
  CompanySort,
} from "@api/types";
import { PaginatedCompanyResponseWithGroupStats } from "../types";

const LIMIT = 25;

export interface GetCoverageDistributionParams {
  metric: string;
  filter: CompanyCatalogRequestFilters;
}

export const useGetCoverageDistribution = ({
  metric,
  filter,
}: GetCoverageDistributionParams) => {
  return useListCompaniesV2<PaginatedCompanyResponseWithGroupStats>({
    page_size: LIMIT,
    sort_by: metric as CompanySort,
    sort_order: "desc",
    includes: [metric as CompanyIncludes],
    filter,
  });
};
