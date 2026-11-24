import { useMemo } from "react";
import { useListEventTracker } from "@api/endpoints/event-tracker/event-tracker";
import { CompanyListRequest } from "@api/types";
import { LogicalOperator } from "@api/types";

export const useCompanyPageEvents = (companyId: number) => {
  const eventTrackerRequest: CompanyListRequest = useMemo(
    () => ({
      page: 1,
      page_size: 100,
      sort_by: null,
      sort_order: "asc",
      includes: [],
      filter: {
        op: LogicalOperator.and,
        filters: [
          {
            op: LogicalOperator.and,
            filters: [
              {
                field: "id",
                op: "eq",
                value: companyId,
              },
              {
                op: LogicalOperator.or,
                filters: [
                  {
                    field: "in_portfolio",
                    op: "eq",
                    value: true,
                  },
                ],
              },
            ],
          },
        ],
      },
      with_events: true,
    }),
    [companyId]
  );

  const { data, isLoading, error } = useListEventTracker(
    eventTrackerRequest,
    undefined,
    {
      query: {
        enabled: !!companyId,
      },
    }
  );

  const companyData = useMemo(() => {
    return data?.items?.[0] || null;
  }, [data]);

  const events = useMemo(() => {
    return companyData?.events || [];
  }, [companyData]);

  return {
    events,
    isLoading,
    error,
  };
};
