import React from "react";
import { IDockviewPanelProps } from "dockview-react";
import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
import { PanelProvider } from "@/providers/PanelProvider";
import { QueryLocalFiltersProvider } from "@/providers/LocalFiltersProvider";
import { YearlyPerformanceOptimized } from "@/modules/dashboard/widgets/YearlyPerformanceOptimized";
import { YearlyAlphaPnLOptimized } from "@/modules/dashboard/widgets/YearlyAlphaPnLOptimized";
import { YearlyAlphaPnLByAnalystOptimized } from "@/modules/dashboard/widgets/YearlyAlphaPnLByAnalystOptimized";

export const YearlyPerformanceOptimizedWidget = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultFilters = props.params.filters;

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <YearlyPerformanceOptimized defaultFilters={defaultFilters} />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const YearlyAlphaPnLOptimizedWidget = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultFilters = props.params.filters;
    const defaultBenchmarkIds = props.params.defaultBenchmarkIds;

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <YearlyAlphaPnLOptimized
              defaultFilters={defaultFilters}
              defaultBenchmarkIds={defaultBenchmarkIds}
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const MedTechYearlyAlphaPnLByAnalyst = React.memo(
  (props: IDockviewPanelProps) => {
    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <YearlyAlphaPnLByAnalystOptimized
              title="MedTech Analyst Yearly Alpha PnL"
              defaultFilters={{
                portfolio_team: ["Medical Technology"],
              }}
              defaultBenchmarkIdOverride="XHE US Equity"
              testIdPrefix="medtech-yearly-alpha-pnl-by-analyst"
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const TherapeuticsYearlyAlphaPnLByAnalyst = React.memo(
  (props: IDockviewPanelProps) => {
    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <YearlyAlphaPnLByAnalystOptimized
              title="Therapeutics Analyst Yearly Alpha PnL"
              defaultFilters={{
                portfolio_team: ["Therapeutics"],
              }}
              defaultBenchmarkIdOverride="XBI US Equity"
              testIdPrefix="therapeutics-yearly-alpha-pnl-by-analyst"
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);
