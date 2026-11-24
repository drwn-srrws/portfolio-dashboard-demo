import Dockview from "@/components/Dockview/Dockview";
import { QueryFiltersProvider } from "@/providers/FiltersProvider";
import { EditTableProvider } from "@/providers/EditTableProvider";
import { useConfig } from "@/providers/ConfigProvider";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { useMemo } from "react";
import { RoleKinds } from "@/typings/Role";
import { hasRole } from "@/utils/roleUtils";
import { components } from "./dockview";
import { QueryMetricFlagsProvider } from "@/providers/MetricFlagsProvider";
import { QueryDateRangeProvider } from "@/providers/DateRangeProvider";
import { Filters } from "@/typings/Filters";
import { MainWrapper } from "@/components/MainWrapper";
import { AppToolbar } from "@/components/Toolbar/components/AppToolbar";
import { CoverageUniverseFilters } from "@/components/Toolbar/components/CoverageUniverseFilters";

export const UniverseDashboardPage = () => {
  const { universeDashboardPagePanelConfig } = useConfig();
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
            <div className="flex size-full flex-col">
              <AppToolbar filtersSlot={<CoverageUniverseFilters />} />
              <MainWrapper>
                <Dockview
                  theme="dockview-theme-dark"
                  components={components}
                  json={universeDashboardPagePanelConfig}
                />
              </MainWrapper>
            </div>
          </EditTableProvider>
        </QueryDateRangeProvider>
      </QueryMetricFlagsProvider>
    </QueryFiltersProvider>
  );
};
