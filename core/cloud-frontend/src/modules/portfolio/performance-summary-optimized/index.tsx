import { QueryFiltersProvider } from "@/providers/FiltersProvider";
import { useConfig } from "@/providers/ConfigProvider";
import { QueryMetricFlagsProvider } from "@/providers/MetricFlagsProvider";
import { QueryDateRangeProvider } from "@/providers/OptimizedDateRangeProvider";
import { PerformanceSummaryOptimizedContent } from "./components/PerformanceSummaryOptimizedContent";
import { useMemo } from "react";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
const metricsQueryFlags = {
  explode_composites: true,
};

export const PerformanceSummaryOptimizedPage = () => {
  const { pages } = useConfig();
  const { account } = useAuth();
  const { defaultFilters, userFilters } =
    pages?.portfolioPerformanceSummary ?? {};

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
          <PerformanceSummaryOptimizedContent />
        </QueryDateRangeProvider>
      </QueryMetricFlagsProvider>
    </QueryFiltersProvider>
  );
};
