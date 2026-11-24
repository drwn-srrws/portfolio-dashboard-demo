import { IDockviewPanelProps } from "dockview-react";
import React from "react";
import { QueryLocalFiltersProvider } from "@/providers/LocalFiltersProvider";
import { BasketBreakdownOptimized as BasketBreakdownOptimizedWidget } from "@/modules/dashboard/widgets/BasketBreakdownOptimized";
import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
import { PanelProvider } from "@/providers/PanelProvider";

export const BasketBreakdownOptimized = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultFilters = props?.params?.defaultFilters || {};

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <BasketBreakdownOptimizedWidget defaultFilters={defaultFilters} />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);
