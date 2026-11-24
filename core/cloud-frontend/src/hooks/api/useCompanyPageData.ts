import { useMemo } from "react";
import { useListCompaniesV2 } from "@api/endpoints/company/company";
import { CompanyIncludes, CompanyListRequest } from "@api/types";
import { LogicalOperator } from "@api/types";

export const useCompanyPageData = (
  companyId: number,
  { includeDrugs = false }: { includeDrugs?: boolean } = {}
) => {
  const consolidatedIncludes: CompanyIncludes[] = useMemo(
    () => [
      CompanyIncludes.primary_instrument,
      CompanyIncludes.average_cost,
      CompanyIncludes.native_average_cost,

      CompanyIncludes.primary_analyst,
      CompanyIncludes.secondary_analysts,
      CompanyIncludes.primary_analyst_upside_price_target,
      CompanyIncludes.primary_analyst_downside_price_target,
      CompanyIncludes.risk_reward,
      CompanyIncludes.volume_bbg,
      CompanyIncludes.market_cap_bbg,
      CompanyIncludes.position_ytd_pnl,
      ...(includeDrugs ? [CompanyIncludes.drugs] : []),
    ],
    [includeDrugs]
  );

  const consolidatedRequest: CompanyListRequest = useMemo(
    () => ({
      page: 1,
      page_size: 1,
      sort_by: "name",
      sort_order: "asc",
      includes: consolidatedIncludes,
      filter: {
        op: LogicalOperator.and,
        filters: [
          {
            op: LogicalOperator.or,
            filters: [
              {
                field: "id",
                op: "eq",
                value: companyId,
              },
            ],
          },
        ],
      },
    }),
    [companyId, consolidatedIncludes]
  );

  const { data, isLoading, error } = useListCompaniesV2(
    consolidatedRequest,
    undefined,
    {
      query: {
        enabled: !!companyId,
      },
    }
  );

  const companyData = useMemo(() => data?.items?.[0] ?? null, [data]);

  return {
    companyData,
    isLoading,
    error,
  };
};
