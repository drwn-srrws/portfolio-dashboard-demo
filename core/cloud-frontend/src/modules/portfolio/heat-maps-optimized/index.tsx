import { HeatMapsOptimizedContent } from "./components/HeatMapsOptimizedContent";
import { useConfig } from "@/providers/ConfigProvider";
import { QueryFiltersProvider } from "@/providers/FiltersProvider";
import { QueryMetricFlagsProvider } from "@/providers/MetricFlagsProvider";
import { QueryDateRangeProvider } from "@/providers/OptimizedDateRangeProvider";
import { useMemo } from "react";
import { useAuth } from "@/modules/auth/providers/AuthProvider";

const metricsQueryFlags = {
  explode_composites: true,
};

export const HeatMapsOptimizedPage = () => {
  const { pages } = useConfig();
  const { account } = useAuth();
  const { defaultFilters, userFilters } = pages?.portfolioHeatMaps ?? {};

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
          <HeatMapsOptimizedContent />
        </QueryDateRangeProvider>
      </QueryMetricFlagsProvider>
    </QueryFiltersProvider>
  );
};
