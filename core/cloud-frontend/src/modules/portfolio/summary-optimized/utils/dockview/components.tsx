import { IDockviewPanelProps } from "dockview-react";
import React from "react";
import { QueryLocalFiltersProvider } from "@/providers/LocalFiltersProvider";
import { PortfolioSummaryOptimized as PortfolioSummaryOptimizedWidget } from "@/modules/dashboard/widgets/PortfolioSummaryOptimized";
import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
import { PanelProvider } from "@/providers/PanelProvider";

export const PortfolioSummaryOptimized = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultFilters = props?.params?.defaultFilters || {};

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <PortfolioSummaryOptimizedWidget defaultFilters={defaultFilters} />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);
