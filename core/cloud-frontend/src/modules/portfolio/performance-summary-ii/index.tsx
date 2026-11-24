import { QueryFiltersProvider } from "@/providers/FiltersProvider";
import { QueryMetricFlagsProvider } from "@/providers/MetricFlagsProvider";
import { QueryDateRangeProvider } from "@/providers/OptimizedDateRangeProvider";

import { PerformanceSummaryIIContent } from "./components/PerformanceSummaryIIContent";

const metricsQueryFlags = {
  explode_composites: true,
};

/**
 * Performance Summary II (Beta) — host page for the three AS5 PM
 * Dashboard 2.0 cards (PnL by Subteam, PnL by New Companies — Company
 * View and Analyst View). Limited to Admin + External Beta User roles
 * via the nav-item auth allowlist; suffix "(Beta)" so it's clear the
 * page is under active QA.
 */
export const PerformanceSummaryIIPage = () => {
  return (
    <QueryFiltersProvider>
      <QueryMetricFlagsProvider defaultMetricFlags={metricsQueryFlags}>
        <QueryDateRangeProvider>
          <PerformanceSummaryIIContent />
        </QueryDateRangeProvider>
      </QueryMetricFlagsProvider>
    </QueryFiltersProvider>
  );
};
