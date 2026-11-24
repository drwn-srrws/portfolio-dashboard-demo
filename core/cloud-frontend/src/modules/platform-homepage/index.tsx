import Dockview from "@/components/Dockview/Dockview";
import { QueryFiltersProvider } from "@/providers/FiltersProvider";
import { EditTableProvider } from "@/providers/EditTableProvider";
import { useConfig } from "@/providers/ConfigProvider";
import { components } from "./utils/dockview";
import { QueryMetricFlagsProvider } from "@/providers/MetricFlagsProvider";
import { QueryDateRangeProvider } from "@/providers/DateRangeProvider";
import { EventMetricFilterContextProvider } from "../portfolio/event-exposure/providers/EventMetricFilterContextProvider";
import { RecentlyViewed } from "./components/RecentlyViewed";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { MainWrapper } from "@/components/MainWrapper";
import { AppToolbar } from "@/components/Toolbar/components/AppToolbar";

const eventMetricFilters = {
  enable_low_impact_filter: false,
};

export const PlatformHomepage = () => {
  const { platformHomepagePanelConfig } = useConfig();
  const { isFeatureEnabled } = useFeatureFlags();

  const isNewHomepageFeatureEnabled = isFeatureEnabled("enableNewHomepage");

  if (!isNewHomepageFeatureEnabled) {
    return null;
  }

  return (
    <EventMetricFilterContextProvider
      defaultEventMetricFilters={eventMetricFilters}
    >
      <QueryFiltersProvider>
        <QueryMetricFlagsProvider>
          <QueryDateRangeProvider>
            <EditTableProvider>
              <>
                <AppToolbar />
                <MainWrapper>
                  <div className="flex size-full flex-col pt-6">
                    <div className="flex flex-col items-center gap-5 md:gap-7 mb-1">
                      <img
                        src={import.meta.env.BASE_URL + "brand-full.svg"}
                        alt="Brand Logo"
                        width={274}
                        height={64}
                      />
                      <div className="flex flex-col gap-2 md:mt-8">
                        <RecentlyViewed />
                      </div>
                    </div>
                    <div className="relative flex flex-1 flex-col overflow-auto md:overflow-hidden ">
                      <Dockview
                        theme="dockview-theme-dark"
                        components={components}
                        json={platformHomepagePanelConfig}
                      />
                    </div>
                  </div>
                </MainWrapper>
              </>
            </EditTableProvider>
          </QueryDateRangeProvider>
        </QueryMetricFlagsProvider>
      </QueryFiltersProvider>
    </EventMetricFilterContextProvider>
  );
};
