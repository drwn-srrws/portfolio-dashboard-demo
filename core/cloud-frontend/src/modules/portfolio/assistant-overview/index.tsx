import { QueryFiltersProvider } from "@/providers/FiltersProvider";
import { useConfig } from "@/providers/ConfigProvider";
import { QueryMetricFlagsProvider } from "@/providers/MetricFlagsProvider";
import { QueryDateRangeProvider } from "@/providers/OptimizedDateRangeProvider";
import { QueryYearProvider } from "@/providers/YearProvider";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { useMemo } from "react";
import Dockview from "@/components/Dockview/Dockview";
import { MainWrapper } from "@components/MainWrapper";
import { components } from "@/modules/portfolio/analyst-overview-optimized/utils/dockview";
import { AppToolbar } from "@/components/Toolbar/components/AppToolbar";
import { ExplodeBaskets } from "@/modules/dashboard/components/ExplodeBaskets";
import { useFeatureFlags } from "@hooks/useFeatureFlags";

const metricsQueryFlags = {
  explode_composites: true,
};

export const AssistantOverviewPage = () => {
  const { pages, portfolioAssistantPagePanelConfig } = useConfig();
  const { account } = useAuth();
  const { isFeatureEnabled } = useFeatureFlags();
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
            <div className="relative flex size-full flex-col">
              <AppToolbar
                secondaryActionSlot={
                  isFeatureEnabled("enableBasketExplosion") && (
                    <ExplodeBaskets />
                  )
                }
              />
              <MainWrapper>
                <Dockview
                  components={components}
                  json={portfolioAssistantPagePanelConfig}
                  theme="dockview-theme-dark"
                />
              </MainWrapper>
            </div>
          </QueryYearProvider>
        </QueryDateRangeProvider>
      </QueryMetricFlagsProvider>
    </QueryFiltersProvider>
  );
};
