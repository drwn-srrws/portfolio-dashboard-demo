import { QueryFiltersProvider } from "@/providers/FiltersProvider";
import { useConfig } from "@/providers/ConfigProvider";
import { PositionDifferencesContent } from "./components/PositionDifferencesContent";
import { QueryMetricFlagsProvider } from "@/providers/MetricFlagsProvider";
import { QueryDateRangeProvider } from "@/providers/DateRangeProvider";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { useMemo } from "react";

const metricsQueryFlags = {
  explode_composites: true,
};

export const PositionDifferencesPage = () => {
  const { pages } = useConfig();
  const { account } = useAuth();
  const { defaultFilters, userFilters } =
    pages?.portfolioPositionDifferences ?? {};

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
    <QueryFiltersProvider defaultFilters={filters}>
      <QueryMetricFlagsProvider defaultMetricFlags={metricsQueryFlags}>
        <QueryDateRangeProvider>
          <PositionDifferencesContent />
        </QueryDateRangeProvider>
      </QueryMetricFlagsProvider>
    </QueryFiltersProvider>
  );
};
