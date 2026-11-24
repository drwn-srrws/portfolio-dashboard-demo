import { IDockviewPanelProps } from "dockview-react";
import React from "react";
import { QueryLocalFiltersProvider } from "@/providers/LocalFiltersProvider";
import { MarketCapDistributionOptimized as MarketCapDistributionOptimizedWidget } from "@/modules/dashboard/widgets/MarketCapDistributionOptimized";
import { LiquiditySummaryOptimized as LiquiditySummaryOptimizedWidget } from "@/modules/dashboard/widgets/LiquiditySummaryOptimized";
import { AnalystBreakdownOptimized as AnalystBreakdownOptimizedWidget } from "@/modules/dashboard/widgets/AnalystBreakdownOptimized";
import { FundSummaryOptimized as FundSummaryOptimizedWidget } from "@/modules/dashboard/widgets/FundSummaryOptimized";
import { FundBreakdownOptimized as FundBreakdownOptimizedWidget } from "@/modules/dashboard/widgets/FundBreakdownOptimized";
import { KgExposureDistributionOptimized as KgExposureDistributionOptimizedWidget } from "@/modules/dashboard/widgets/KgExposureDistributionOptimized";
import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
import { PanelProvider } from "@/providers/PanelProvider";

export const MarketCapDistributionOptimized = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultFilters = props?.params?.defaultFilters || {};

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <MarketCapDistributionOptimizedWidget
              defaultFilters={defaultFilters}
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const LiquiditySummaryOptimized = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultFilters = props?.params?.defaultFilters || {};

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <LiquiditySummaryOptimizedWidget defaultFilters={defaultFilters} />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const AnalystBreakdownOptimized = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultFilters = props?.params?.defaultFilters || {};

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <AnalystBreakdownOptimizedWidget defaultFilters={defaultFilters} />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const FundSummaryOptimized = React.memo((props: IDockviewPanelProps) => {
  const defaultFilters = props?.params?.defaultFilters || {};

  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <FundSummaryOptimizedWidget defaultFilters={defaultFilters} />
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const FundBreakdownOptimized = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultFilters = props?.params?.defaultFilters || {};

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <FundBreakdownOptimizedWidget defaultFilters={defaultFilters} />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const KgModalityDistributionOptimized = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultFilters = props?.params?.defaultFilters || {};

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <KgExposureDistributionOptimizedWidget
              dimension="modality"
              title="Modality Distribution"
              testId="kg-modality-distribution-optimized"
              defaultFilters={defaultFilters}
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const KgTaDistributionOptimized = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultFilters = props?.params?.defaultFilters || {};

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <KgExposureDistributionOptimizedWidget
              dimension="ta"
              title="Therapeutic Area Distribution"
              testId="kg-ta-distribution-optimized"
              defaultFilters={defaultFilters}
              groupColumnMinWidth={140}
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const KgStageDistributionOptimized = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultFilters = props?.params?.defaultFilters || {};

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <KgExposureDistributionOptimizedWidget
              dimension="stage"
              title="Development Stage Distribution"
              testId="kg-stage-distribution-optimized"
              defaultFilters={defaultFilters}
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const KgGeographyDistributionOptimized = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultFilters = props?.params?.defaultFilters || {};

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <KgExposureDistributionOptimizedWidget
              dimension="geography"
              title="Geography Distribution"
              testId="kg-geography-distribution-optimized"
              defaultFilters={defaultFilters}
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);
