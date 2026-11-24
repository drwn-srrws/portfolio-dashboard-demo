import { QueryFiltersProvider } from "@/providers/FiltersProvider";
import { EventExposureContent } from "./components/EventExposureContent";
import { EventMetricFilterContextProvider } from "./providers/EventMetricFilterContextProvider";
import { QueryMetricFlagsProvider } from "@/providers/MetricFlagsProvider";
import { QueryDateRangeProvider } from "@/providers/DateRangeProvider";
import { useConfig } from "@/providers/ConfigProvider";
import { useMemo } from "react";
import { useAuth } from "@/modules/auth/providers/AuthProvider";

const metricsQueryFlags = {
  explode_composites: true,
};

const eventMetricFilters = {
  enable_low_impact_filter: false,
};

export const EventExposurePage = () => {
  const { pages } = useConfig();
  const { account } = useAuth();

  const { defaultFilters, userFilters } = pages?.portfolioEventExposure ?? {};

  const filters = useMemo(() => {
    if (!account || !userFilters) return defaultFilters?.filters;

    if (userFilters.emails.includes(account.email)) {
      return {
        ...defaultFilters?.filters,
        ...userFilters.filters,
      };
    }

    return defaultFilters?.filters;
  }, [defaultFilters, userFilters, account]);

  return (
    <EventMetricFilterContextProvider
      defaultEventMetricFilters={eventMetricFilters}
    >
      <QueryFiltersProvider defaultFilters={filters}>
        <QueryMetricFlagsProvider defaultMetricFlags={metricsQueryFlags}>
          <QueryDateRangeProvider>
            <EventExposureContent />
          </QueryDateRangeProvider>
        </QueryMetricFlagsProvider>
      </QueryFiltersProvider>
    </EventMetricFilterContextProvider>
  );
};
