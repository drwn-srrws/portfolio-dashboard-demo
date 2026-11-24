import { useMemo } from "react";
import Dockview from "@components/Dockview/Dockview";
import { QueryFiltersProvider } from "@providers/FiltersProvider";
import { EditTableProvider } from "@providers/EditTableProvider";
import { useConfig } from "@providers/ConfigProvider";
import { useAuth } from "@modules/auth/providers/AuthProvider";
import { RoleKinds } from "@typings/Role";
import { hasRole } from "@/utils/roleUtils";
import { Filters } from "@typings/Filters";
import { QueryMetricFlagsProvider } from "@providers/MetricFlagsProvider";
import { QueryDateRangeProvider } from "@providers/DateRangeProvider";
import { MainWrapper } from "@components/MainWrapper";
import { AppToolbar } from "@components/Toolbar/components/AppToolbar";
import { components } from "./utils/dockview";
import { CoverageUniverseFilters } from "@/components/Toolbar/components/CoverageUniverseFilters";

export const CoverageMonitorPage = () => {
  const { coverageMonitorPagePanelConfig } = useConfig();
  const { account } = useAuth();

  const defaultFilters: Filters = useMemo(() => {
    if (!account) return {} as Filters;
    if (!hasRole(account.roles, [RoleKinds.Analyst])) return {} as Filters;

    return {
      "analyst.name": [`${account.first_name} ${account.last_name}`],
    };
  }, [account]);

  return (
    <QueryFiltersProvider defaultFilters={defaultFilters}>
      <QueryMetricFlagsProvider>
        <QueryDateRangeProvider>
          <EditTableProvider>
            <AppToolbar filtersSlot={<CoverageUniverseFilters />} />
            <MainWrapper>
              <Dockview
                theme="dockview-theme-dark"
                components={components}
                json={coverageMonitorPagePanelConfig}
              />
            </MainWrapper>
          </EditTableProvider>
        </QueryDateRangeProvider>
      </QueryMetricFlagsProvider>
    </QueryFiltersProvider>
  );
};
