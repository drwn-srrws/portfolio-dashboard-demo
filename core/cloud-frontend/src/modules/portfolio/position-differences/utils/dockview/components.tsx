import { IDockviewPanelProps } from "dockview-react";
import React from "react";
import { PositionDifferencesTable as PositionDifferencesWidget } from "@/modules/dashboard/widgets/PositionDifferencesTable";
import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
import { PanelProvider } from "@/providers/PanelProvider";
import { QueryLocalFiltersProvider } from "@/providers/LocalFiltersProvider";

export const PositionDifferencesTable = React.memo(
  (props: IDockviewPanelProps) => {
    const metrics = props.params.metrics || [];
    const groupByMetrics = props.params.groupByMetrics || [];
    const defaultFilters = props.params.filterSettings?.filters || {};
    const fundNames = props.params.fundNames || [];

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <PositionDifferencesWidget
              metrics={metrics}
              groupByMetrics={groupByMetrics}
              defaultFilters={defaultFilters}
              fundNames={fundNames}
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);
