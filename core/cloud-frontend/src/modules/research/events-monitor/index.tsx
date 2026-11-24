import Dockview from "@components/Dockview/Dockview";
import { QueryFiltersProvider } from "@providers/FiltersProvider";
import { EditTableProvider } from "@providers/EditTableProvider";
import { QueryMetricFlagsProvider } from "@providers/MetricFlagsProvider";
import { MainWrapper } from "@components/MainWrapper";
import { AppToolbar } from "@components/Toolbar/components/AppToolbar";
import { useConfig } from "@/providers/ConfigProvider";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { useMemo } from "react";
import { components } from "./utils/dockview";
import config from "./config/index.json";
import { SerializedDockview } from "dockview-react";
import { EventsMonitorFilters } from "@components/Toolbar/components/EventsMonitorFilters";

export const EventTrackerNewPage = () => {
  const { eventTrackerNewPagePanelConfig } = config;
  const { pages } = useConfig();
  const { account } = useAuth();
  const { defaultFilters, userFilters } = pages?.eventTrackerNew ?? {};

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
      <QueryMetricFlagsProvider>
        <EditTableProvider>
          <AppToolbar
            filtersSlot={<EventsMonitorFilters />}
            disableDateRange={true}
          />
          <MainWrapper>
            <Dockview
              theme="dockview-theme-dark"
              components={components}
              json={eventTrackerNewPagePanelConfig as SerializedDockview}
            />
          </MainWrapper>
        </EditTableProvider>
      </QueryMetricFlagsProvider>
    </QueryFiltersProvider>
  );
};
