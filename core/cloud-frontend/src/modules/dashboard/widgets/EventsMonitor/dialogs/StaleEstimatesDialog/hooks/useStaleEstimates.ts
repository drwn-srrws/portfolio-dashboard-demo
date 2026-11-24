import { UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";
import { subWeeks, subMonths, addMonths, format } from "date-fns";
import {
  CompanyEventResponse,
  CompanyEventEstimateResponse,
  CompanyLogicalFilterFiltersItem,
  ComparisonOperator,
  CompanyFilterField,
  LogicalOperator,
  PaginatedCompanyResponse,
  UserResponse,
} from "@/api/types";
import { StaleEstimate } from "../types/StaleEstimatesData";
import { useEventsMonitor } from "../../../hooks/useEventsMonitor";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { isAdmin } from "@utils/roleUtils";

export interface StaleEstimatesResponse {
  items: StaleEstimate[];
  total_pages: number;
  total_items: number;
  current_page: number;
}

const STALE_ESTIMATES_CONFIG = {
  WEEKS_AGO: 2,
  PAGE_SIZE: 100,
} as const;

const createAnalystName = (
  firstName?: string,
  lastName?: string
): string | undefined => {
  if (!firstName) return undefined;
  return `${firstName} ${lastName || ""}`.trim();
};

const transformEventToStaleEstimate = (
  event: CompanyEventResponse & {
    estimates?: CompanyEventEstimateResponse[];
  },
  companyId: number,
  companyName: string,
  primaryAnalyst?: UserResponse
): StaleEstimate => {
  const estimate = event.estimate!;
  const allEstimates = event.estimates || [];

  return {
    id: `${companyId}-${event.id}`,
    eventId: event.id,
    companyId,
    companyName,
    eventName: event.name,
    eventDescription: event.description || "",
    eventDate: event.date,
    upsideEstimate: estimate.implied_upside_price_usd || 0,
    upsideNote: estimate.upside_notes || "",
    downsideEstimate: estimate.implied_downside_price_usd || 0,
    downsideNote: estimate.downside_notes || "",
    lastUpdated: estimate.updated_at_utc || "",
    analystName: createAnalystName(
      estimate.created_by?.first_name,
      estimate.created_by?.last_name
    ),
    upsidePercentage: estimate.upside_percentage || 0,
    upsideProbability: estimate.upside_probability,
    downsidePercentage: estimate.downside_percentage || 0,
    downsideProbability: estimate.downside_probability,
    userId: estimate.created_by?.id || 0,
    estimates: allEstimates,
    primaryAnalyst,
    reaffirm: false,
  };
};

const createEmptyStaleEstimatesResponse = (): StaleEstimatesResponse => ({
  items: [],
  total_pages: 1,
  total_items: 0,
  current_page: 1,
});

const transformDataToStaleEstimates = (
  data: PaginatedCompanyResponse
): StaleEstimatesResponse => {
  const items = data.items.flatMap((company) => {
    return (
      company.events
        ?.filter((event) => {
          return event.estimate?.updated_at_utc;
        })
        .map((event) =>
          transformEventToStaleEstimate(
            {
              ...event,
              estimates: event.estimates || undefined,
            },
            company.id,
            company.name,
            company.primary_analyst || undefined
          )
        ) || []
    );
  });

  return {
    items,
    total_pages: data.total_pages,
    total_items: data.total,
    current_page: data.page,
  };
};

export const useStaleEstimates = (
  invalidateCache = false,
  enabled = false
): UseQueryResult<StaleEstimatesResponse, unknown> & {
  hasStaleEstimates: boolean;
} => {
  const { account } = useAuth();

  const defaultFilters: CompanyLogicalFilterFiltersItem[] = useMemo(() => {
    const today = new Date();
    const threeMonthsAhead = format(addMonths(today, 3), "yyyy-MM-dd");
    const sixMonthsAhead = format(addMonths(today, 6), "yyyy-MM-dd");
    const twoWeeksAgo = format(subWeeks(today, 2), "yyyy-MM-dd");
    const oneMonthAgo = format(subMonths(today, 1), "yyyy-MM-dd");
    const threeMonthsAgo = format(subMonths(today, 3), "yyyy-MM-dd");

    const filters: CompanyLogicalFilterFiltersItem = {
      op: LogicalOperator.or,
      filters: [
        {
          op: LogicalOperator.and,
          filters: [
            {
              field: CompanyFilterField.eventsis_passed,
              op: ComparisonOperator.eq,
              value: false,
            },
            {
              field: CompanyFilterField.eventsdate,
              op: ComparisonOperator.lte,
              value: threeMonthsAhead,
            },
            {
              field: CompanyFilterField.eventsestimateupdated_at_utc,
              op: ComparisonOperator.lt,
              value: twoWeeksAgo,
            },
          ],
        },
        {
          op: LogicalOperator.and,
          filters: [
            {
              field: CompanyFilterField.eventsis_passed,
              op: ComparisonOperator.eq,
              value: false,
            },
            {
              field: CompanyFilterField.eventsdate,
              op: ComparisonOperator.lte,
              value: sixMonthsAhead,
            },
            {
              field: CompanyFilterField.eventsdate,
              op: ComparisonOperator.gt,
              value: threeMonthsAhead,
            },
            {
              field: CompanyFilterField.eventsestimateupdated_at_utc,
              op: ComparisonOperator.lt,
              value: oneMonthAgo,
            },
          ],
        },
        {
          op: LogicalOperator.and,
          filters: [
            {
              field: CompanyFilterField.eventsis_passed,
              op: ComparisonOperator.eq,
              value: false,
            },
            {
              field: CompanyFilterField.eventsdate,
              op: ComparisonOperator.gt,
              value: sixMonthsAhead,
            },
            {
              field: CompanyFilterField.eventsestimateupdated_at_utc,
              op: ComparisonOperator.lt,
              value: threeMonthsAgo,
            },
          ],
        },
      ],
    };

    const analystFilter: CompanyLogicalFilterFiltersItem = {
      field: CompanyFilterField.eventsestimatecreated_byname,
      op: ComparisonOperator.eq,
      value: `${account?.first_name} ${account?.last_name}`,
    };

    const inPortfolioFilter: CompanyLogicalFilterFiltersItem = {
      field: CompanyFilterField.in_portfolio,
      op: ComparisonOperator.eq,
      value: true,
    };

    return isAdmin(account?.roles)
      ? [filters, inPortfolioFilter]
      : [analystFilter, filters, inPortfolioFilter];
  }, [account?.roles, account?.first_name, account?.last_name]);

  const eventsMonitorQuery = useEventsMonitor({
    page: 1,
    page_size: STALE_ESTIMATES_CONFIG.PAGE_SIZE,
    sort_by: null,
    sort_order: "asc",
    includes: [],
    searchQuery: "",
    defaultFilters,
    sharedFilters: {},
    with_events: true,
    invalidate_cache: invalidateCache,
    enabled: enabled,
  });

  const transformedData = useMemo(() => {
    if (!eventsMonitorQuery.data) {
      return createEmptyStaleEstimatesResponse();
    }
    return transformDataToStaleEstimates(eventsMonitorQuery.data);
  }, [eventsMonitorQuery.data]);

  return {
    ...eventsMonitorQuery,
    data: transformedData,
    refetch: eventsMonitorQuery.refetch,
    hasStaleEstimates: Boolean(transformedData?.items?.length),
  } as unknown as UseQueryResult<StaleEstimatesResponse, unknown> & {
    hasStaleEstimates: boolean;
  };
};
