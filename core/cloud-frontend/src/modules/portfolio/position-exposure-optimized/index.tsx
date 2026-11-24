import { QueryFiltersProvider } from "@/providers/FiltersProvider";
import { PositionExposureOptimizedContent } from "./components/PositionExposureOptimizedContent";
import { useConfig } from "@/providers/ConfigProvider";
import { QueryMetricFlagsProvider } from "@/providers/MetricFlagsProvider";
import { QueryDateRangeProvider } from "@/providers/OptimizedDateRangeProvider";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { useMemo } from "react";

const metricsQueryFlags = {
  explode_composites: true,
};

export const PositionExposureOptimizedPage = () => {
  const { pages } = useConfig();
  const { account } = useAuth();
  const { defaultFilters, userFilters } =
    pages?.portfolioPositionExposure ?? {};

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
          <PositionExposureOptimizedContent />
        </QueryDateRangeProvider>
      </QueryMetricFlagsProvider>
    </QueryFiltersProvider>
  );
};
