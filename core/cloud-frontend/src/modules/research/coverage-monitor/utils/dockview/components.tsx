import { IDockviewPanelProps } from "dockview-react";
import React from "react";

import { CompanyCatalogRequestFilters } from "@/api/types";
import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
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
  const enabledColumns = props.params?.enabledColumns;

  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <ChangeHistoryProvider
          config={coverageUniverseHistoryConfig}
          localStorageKey="coverage-monitor-history"
        >
          <QueryLocalFiltersProvider>
            <CoverageUniverseWidget
              defaultAdvancedFilter={defaultAdvancedFilter}
              metrics={metrics}
              enabledColumns={enabledColumns}
            />
          </QueryLocalFiltersProvider>
        </ChangeHistoryProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});
