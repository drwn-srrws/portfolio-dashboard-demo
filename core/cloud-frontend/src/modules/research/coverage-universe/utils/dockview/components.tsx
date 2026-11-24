import { IDockviewPanelProps } from "dockview-react";
import React from "react";

import { CompanyCatalogRequestFilters } from "@/api/types";
import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
import { CoverageCalendar as CoverageCalendarWidget } from "@/modules/dashboard/widgets/CoverageCalendar";
import { CoverageUniverse as CoverageUniverseWidget } from "@/modules/dashboard/widgets/CoverageUniverse";
import { PanelProvider } from "@/providers/PanelProvider";
import { QueryLocalFiltersProvider } from "@/providers/LocalFiltersProvider";
import { ChangeHistoryProvider } from "@/modules/dashboard/providers/ChangeHistoryProvider";
import { coverageUniverseHistoryConfig } from "@/modules/dashboard/widgets/CoverageUniverse/configs/coverageUniverseHistoryConfig";

export const CoverageMonitorTable = React.memo((props: IDockviewPanelProps) => {
  const defaultAdvancedFilter: CompanyCatalogRequestFilters[] = props.params
    ?.filter?.hiddenFilters
    ? [props.params?.filter?.hiddenFilters]
    : [];

  const metrics = props.params?.metrics;

  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <ChangeHistoryProvider
          config={coverageUniverseHistoryConfig}
          localStorageKey="coverage-universe-history"
        >
          <QueryLocalFiltersProvider>
            <CoverageUniverseWidget
              defaultAdvancedFilter={defaultAdvancedFilter}
              metrics={metrics}
            />
          </QueryLocalFiltersProvider>
        </ChangeHistoryProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const CoverageCalendar = React.memo((props: IDockviewPanelProps) => {
  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <CoverageCalendarWidget />
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});
