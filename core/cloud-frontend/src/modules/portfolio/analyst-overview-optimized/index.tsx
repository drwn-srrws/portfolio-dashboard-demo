import { QueryFiltersProvider } from "@/providers/FiltersProvider";
import { AnalystOverviewOptimizedContent } from "./components/AnalystOverviewOptimizedContent";
import { useConfig } from "@/providers/ConfigProvider";
import { QueryMetricFlagsProvider } from "@/providers/MetricFlagsProvider";
import { QueryDateRangeProvider } from "@/providers/OptimizedDateRangeProvider";
import { QueryYearProvider } from "@/providers/YearProvider";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { useMemo } from "react";

const metricsQueryFlags = {
  explode_composites: true,
};

export const AnalystOverviewOptimizedPage = () => {
  const { pages } = useConfig();
  const { account } = useAuth();
  const { defaultFilters, userFilters } = pages?.portfolioAnalystOverview ?? {};

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
          <QueryYearProvider>
            <AnalystOverviewOptimizedContent />
          </QueryYearProvider>
        </QueryDateRangeProvider>
      </QueryMetricFlagsProvider>
    </QueryFiltersProvider>
  );
};
