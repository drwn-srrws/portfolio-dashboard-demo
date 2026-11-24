import { IDockviewPanelProps } from "dockview-react";
import React from "react";
import { BattingAndSluggingTable as BattingAndSluggingTableOptimizedWidget } from "@/modules/dashboard/widgets/BattingAndSluggingTableOptimized";
import { FundPerformanceTable as FundPerformanceOptimizedWidget } from "@/modules/dashboard/widgets/FundPerformanceOptimized";
import { WinnersAndLosersInvestmentOptimized as WinnersAndLosersInvestmentOptimizedWidget } from "@/modules/dashboard/widgets/WinnersAndLosersInvestmentOptimized";
import { WinnersAndLosersAnalystOptimized as WinnersAndLosersAnalystOptimizedWidget } from "@/modules/dashboard/widgets/WinnersAndLosersAnalystOptimized";
import { PerformanceOverviewOptimized as PerformanceOverviewOptimizedWidget } from "@/modules/dashboard/widgets/PerformanceOverviewOptimized";
import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
import { PanelProvider } from "@/providers/PanelProvider";
import { QueryLocalFiltersProvider } from "@/providers/LocalFiltersProvider";

export const BattingAndSluggingTable = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultSortByMetric = props.params.defaultSortByMetric;
    const defaultSortDirection = props.params.defaultSortDirection;
    const defaultGroupByMetric = props.params.defaultGroupByMetric;

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <BattingAndSluggingTableOptimizedWidget
              defaultSortByMetric={defaultSortByMetric}
              defaultSortDirection={defaultSortDirection}
              defaultGroupByMetric={defaultGroupByMetric}
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const FundPerformance = React.memo((props: IDockviewPanelProps) => {
  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <FundPerformanceOptimizedWidget />
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const WinnersAndLosersAnalysts = React.memo(
  (props: IDockviewPanelProps) => {
    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <WinnersAndLosersAnalystOptimizedWidget />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const PerformanceOverview = React.memo((props: IDockviewPanelProps) => {
  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <PerformanceOverviewOptimizedWidget />
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const WinnersAndLosersMedTech = React.memo(
  (props: IDockviewPanelProps) => {
    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <WinnersAndLosersInvestmentOptimizedWidget
              title="MedTech Top Winners & Losers"
              defaultFilters={{
                company_subsector: ["Medical Technology"],
              }}
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const WinnersAndLosersTherapeutics = React.memo(
  (props: IDockviewPanelProps) => {
    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <WinnersAndLosersInvestmentOptimizedWidget
              title="Therapeutics Top Winners & Losers"
              defaultFilters={{
                company_subsector: ["Therapeutics"],
              }}
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);
