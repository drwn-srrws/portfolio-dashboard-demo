import { IDockviewPanelProps } from "dockview-react";
import React from "react";
import { QueryLocalFiltersProvider } from "@/providers/LocalFiltersProvider";
import { PerformanceDistributionOptimized as PerformanceDistributionOptimizedWidget } from "@/modules/dashboard/widgets/PerformanceDistributionOptimized";
import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
import { PanelProvider } from "@/providers/PanelProvider";

export const PerformanceDistributionOptimized = React.memo(
  (props: IDockviewPanelProps) => {
    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <PerformanceDistributionOptimizedWidget />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);
