import { QueryFiltersProvider } from "@/providers/FiltersProvider";
import { useConfig } from "@/providers/ConfigProvider";
import { QueryMetricFlagsProvider } from "@/providers/MetricFlagsProvider";
import { QueryDateRangeProvider } from "@/providers/OptimizedDateRangeProvider";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { useMemo } from "react";
import { LtdAlphaTwoContent } from "./components/LtdAlphaTwoContent";

const metricsQueryFlags = {
  explode_composites: true,
};

export const LtdAlphaTwoPage = () => {
  const { pages } = useConfig();
  const { account } = useAuth();
  const { defaultFilters, userFilters } =
    pages?.portfolioLtdAlphaOptimized ?? {};

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
          <LtdAlphaTwoContent />
        </QueryDateRangeProvider>
      </QueryMetricFlagsProvider>
    </QueryFiltersProvider>
  );
};
