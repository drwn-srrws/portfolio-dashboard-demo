import React from "react";
import { FundPerformanceTable as FundPerformanceOptimizedWidget } from "@/modules/dashboard/widgets/FundPerformanceOptimized";
import { MonthlyPerformanceOptimized as MonthlyPerformanceOptimizedWidget } from "@/modules/dashboard/widgets/MonthlyPerformanceOptimized";
import { IDockviewPanelProps } from "dockview-react";
import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
import { PanelProvider } from "@/providers/PanelProvider/PanelProvider";
import { QueryLocalFiltersProvider } from "@/providers/LocalFiltersProvider/QueryLocalFiltersProvider";
import { PerformanceOverviewOptimized as PerformanceOverviewOptimizedWidget } from "@/modules/dashboard/widgets/PerformanceOverviewOptimized";
import { WinnersAndLosersInvestmentOptimized as WinnersAndLosersOptimizedWidget } from "@/modules/dashboard/widgets/WinnersAndLosersInvestmentOptimized";
import { PortfolioSummaryAnalystOptimized as PortfolioSummaryAnalystOptimizedWidget } from "@/modules/dashboard/widgets/PortfolioSummaryAnalystOptimized";
import { BasketBreakdownOptimized as BasketBreakdownOptimizedWidget } from "@/modules/dashboard/widgets/BasketBreakdownOptimized";
import { QueryLocalYearProvider } from "@/providers/LocalYearProvider";

export const PortfolioSummary = React.memo((props: IDockviewPanelProps) => {
  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <PortfolioSummaryAnalystOptimizedWidget />
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

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

export const BasketBreakdownTable = React.memo((props: IDockviewPanelProps) => {
  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <BasketBreakdownOptimizedWidget />
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

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

export const MonthlyPerformanceOptimized = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultFilters = props?.params?.defaultFilters || {};

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <QueryLocalYearProvider>
              <MonthlyPerformanceOptimizedWidget
                defaultFilters={defaultFilters}
              />
            </QueryLocalYearProvider>
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const WinnersAndLosers = React.memo((props: IDockviewPanelProps) => {
  const defaultFilters = props?.params?.defaultFilters || {};
  const showDateRangeSelect = props?.params?.showDateRangeSelect || false;
  const showTopSelect = props?.params?.showTopSelect || false;
  const showGroupBySelect = props?.params?.showGroupBySelect || false;

  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <WinnersAndLosersOptimizedWidget
            defaultFilters={defaultFilters}
            showDateRangeSelect={showDateRangeSelect}
            showTopSelect={showTopSelect}
            showGroupBySelect={showGroupBySelect}
          />
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});
