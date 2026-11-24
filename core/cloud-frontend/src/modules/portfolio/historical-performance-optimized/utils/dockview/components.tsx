import { IDockviewPanelProps } from "dockview-react";
import React from "react";
import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
import { PanelProvider } from "@/providers/PanelProvider";
import { QueryLocalFiltersProvider } from "@/providers/LocalFiltersProvider";
import { QueryLocalYearProvider } from "@/providers/LocalYearProvider";
import { HistoricalMonthlyPerformanceOptimized } from "@/modules/dashboard/widgets/HistoricalMonthlyPerformanceOptimized";
import { HistoricalMonthlyAlphaPerfOptimized } from "@/modules/dashboard/widgets/HistoricalMonthlyAlphaPerfOptimized";

const CURRENT_YEAR = String(new Date().getFullYear());

export const HistoricalMonthlyPerformanceOptimizedWidget = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultFilters = props.params.filters;

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <QueryLocalYearProvider defaultYear={CURRENT_YEAR}>
              <HistoricalMonthlyPerformanceOptimized
                defaultFilters={defaultFilters}
              />
            </QueryLocalYearProvider>
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const HistoricalMonthlyAlphaPerfOptimizedWidget = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultFilters = props.params.filters;

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <QueryLocalYearProvider defaultYear={CURRENT_YEAR}>
              <HistoricalMonthlyAlphaPerfOptimized
                defaultFilters={defaultFilters}
              />
            </QueryLocalYearProvider>
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);
