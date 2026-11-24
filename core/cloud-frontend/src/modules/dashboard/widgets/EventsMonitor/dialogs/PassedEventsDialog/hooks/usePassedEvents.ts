import { useMemo } from "react";
import { useEventsMonitor } from "../../../hooks/useEventsMonitor";
import { PassedEvent } from "../types/PassedEventsData";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { format } from "date-fns";
import { isAdmin } from "@utils/roleUtils";
import { CompanyFilterField } from "@/api/types";

export const usePassedEvents = (invalidateCache = false, enabled = false) => {
  const { account } = useAuth();

  const defaultFilters = useMemo(() => {
    const baseFilters = [
      {
        op: "or" as const,
        filters: [
          {
            field: CompanyFilterField.eventsis_passed,
            op: "eq" as const,
            value: false,
          },
        ],
      },
      {
        op: "or" as const,
        filters: [
          {
            field: "events.date" as const,
            op: "lt" as const,
            value: format(new Date(), "yyyy-MM-dd"),
          },
        ],
      },
    ];

    const analystFilter = {
      op: "or" as const,
      filters: [
        {
          field: CompanyFilterField.analystname,
          op: "eq" as const,
          value: `${account?.first_name} ${account?.last_name}`,
        },
      ],
    };

    const inPortfolioFilter = {
      op: "or" as const,
      filters: [
        {
          field: CompanyFilterField.in_portfolio,
          op: "eq" as const,
          value: true,
        },
      ],
    };

    const filters = isAdmin(account?.roles)
      ? [...baseFilters, inPortfolioFilter]
      : [analystFilter, ...baseFilters, inPortfolioFilter];

    return [
      {
        op: "and" as const,
        filters,
      },
    ];
  }, [account?.roles, account?.first_name, account?.last_name]);

  const eventsMonitorQuery = useEventsMonitor({
    page: 1,
    page_size: 100,
    sort_by: null,
    sort_order: "asc",
    with_events: true,
    searchQuery: "",
    sharedFilters: {},
    defaultFilters,
    invalidate_cache: invalidateCache,
    enabled: enabled,
  });

  const { data, isLoading, error, refetch } = eventsMonitorQuery;

  const passedEvents = useMemo((): PassedEvent[] => {
    if (!data?.items) return [];

    return data.items.flatMap(
      (company) =>
        company.events?.map((event) => {
          return {
            eventId: Number(event.id),
            companyName: company.name,
            eventName: event.name,
            eventDescription: String(event.description || ""),
            eventDate: event.date,
            hasPassed: event.is_passed ?? false,
          };
        }) || []
    );
  }, [data]);

  return {
    ...eventsMonitorQuery,
    passedEvents,
    isLoading,
    error,
    hasPassedEvents: passedEvents.length > 0,
    refetch,
  };
};
