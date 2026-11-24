import { QueryFiltersProvider } from "@/providers/FiltersProvider";
import { PortfolioSummaryOptimizedContent } from "../summary-optimized/components/PortfolioSummaryOptimizedContent";
import { QueryMetricFlagsProvider } from "@/providers/MetricFlagsProvider";
import { QueryDateRangeProvider } from "@/providers/OptimizedDateRangeProvider";

const metricsQueryFlags = {
  explode_composites: true,
};

const defaultFilters = {
  illiquid_private: [true],
};

export const PrivatePortfolioPage = () => {
  return (
    <QueryFiltersProvider defaultFilters={defaultFilters}>
      <QueryMetricFlagsProvider defaultMetricFlags={metricsQueryFlags}>
        <QueryDateRangeProvider>
          <PortfolioSummaryOptimizedContent />
        </QueryDateRangeProvider>
      </QueryMetricFlagsProvider>
    </QueryFiltersProvider>
  );
};
