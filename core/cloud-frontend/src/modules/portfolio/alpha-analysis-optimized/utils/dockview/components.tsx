import { IDockviewPanelProps } from "dockview-react";
import React from "react";
import { QueryLocalFiltersProvider } from "@/providers/LocalFiltersProvider";
import { AlphaAnalysis } from "@/modules/dashboard/widgets/AlphaAnalysisOptimized";
import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
import { PanelProvider } from "@/providers/PanelProvider";
import { MergedAnalystBreakdownTable as MergedAnalystBreakdownTableWidget } from "@/modules/dashboard/widgets/MergedAnalystBreakdownTableOptimized";
import { AlphaAnalystBreakdownOptimized as AlphaAnalystBreakdownOptimizedWidget } from "@/modules/dashboard/widgets/AlphaAnalystBreakdownOptimized";

export const AlphaAnalysisWidget = React.memo((props: IDockviewPanelProps) => {
  const defaultBenchmarkId = props.params.defaultBenchmarkId;

  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <AlphaAnalysis defaultBenchmarkId={defaultBenchmarkId} />
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const AlphaAnalysisByMarketCap = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultBenchmarkId = props.params.defaultBenchmarkId;

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <AlphaAnalysis
              defaultBenchmarkId={defaultBenchmarkId}
              title="Alpha Analysis by Market Cap"
              fixedGroupBy="market_cap"
              alignDataLeft
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const MedTechAnalystPerformance = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultFilters = props.params.defaultFilters;
    const benchmarkIds = props.params.benchmarkIds;
    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <AlphaAnalystBreakdownOptimizedWidget
              defaultFilters={defaultFilters}
              benchmarkIds={benchmarkIds}
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const TherapeuticsAnalystPerformance = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultFilters = props.params.defaultFilters;
    const benchmarkIds = props.params.benchmarkIds;
    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <AlphaAnalystBreakdownOptimizedWidget
              defaultFilters={defaultFilters}
              benchmarkIds={benchmarkIds}
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const AlphaMergedAnalystBreakdown = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultFilters = props.params.defaultFilters;
    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <MergedAnalystBreakdownTableWidget
              defaultFilters={defaultFilters}
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);
