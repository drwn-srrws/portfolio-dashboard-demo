import { IDockviewPanelProps } from "dockview-react";
import React from "react";
import { QueryLocalFiltersProvider } from "@/providers/LocalFiltersProvider";
import { PositionDifferencesTableOptimized as PositionDifferencesTableOptimizedWidget } from "@/modules/dashboard/widgets/PositionDifferencesTableOptimized";
import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
import { PanelProvider } from "@/providers/PanelProvider";

export const PositionDifferencesTableOptimized = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultCombinationIndex = props?.params?.defaultCombinationIndex ?? 0;

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <PositionDifferencesTableOptimizedWidget
              defaultCombinationIndex={defaultCombinationIndex}
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);
