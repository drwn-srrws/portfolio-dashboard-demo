import { IDockviewPanelProps } from "dockview-react";
import React from "react";
import { QueryLocalFiltersProvider } from "@/providers/LocalFiltersProvider";
import { AnalystBreakdownTable as AnalystBreakdownTableWidget } from "@/modules/dashboard/widgets/AnalystBreakdownTable";
import { FundBreakdownTable as FundBreakdownTableWidget } from "@/modules/dashboard/widgets/FundBreakdownTable";
import { LiquiditySummaryTable } from "@/modules/dashboard/widgets/LiquiditySummaryTable";
import { MarketCapDistributionTable as MarketCapDistributionTableWidget } from "@/modules/dashboard/widgets/MarketCapDistributionTable";
import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
import { PanelProvider } from "@/providers/PanelProvider";
import { FundSummaryTable as FundSummaryTableWidget } from "@/modules/dashboard/widgets/FundSummary";

export const LiquiditySummary = React.memo((props: IDockviewPanelProps) => {
  const defaultMetrics = props.params.defaultMetrics;
  const defaultGroupByMetric = props.params.defaultGroupByMetric;

  const defaultSubgroupBy = props.params.defaultSubgroupBy;

  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <LiquiditySummaryTable
            defaultMetrics={defaultMetrics}
            defaultGroupByMetric={defaultGroupByMetric}
            defaultSubgroupBy={defaultSubgroupBy}
          />
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const MarketCapDistributionTable = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultGroupByMetric = props.params.defaultGroupByMetric;
    const defaultMetrics = props.params.defaultMetrics;
    const defaultSubgroupBy = props.params.defaultSubgroupBy;

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <MarketCapDistributionTableWidget
              defaultGroupByMetric={defaultGroupByMetric}
              defaultMetrics={defaultMetrics}
              defaultSubgroupBy={defaultSubgroupBy}
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const FundSummaryTable = React.memo((props: IDockviewPanelProps) => {
  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <FundSummaryTableWidget />
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const FundBreakdownTable = React.memo((props: IDockviewPanelProps) => {
  const defaultGroupByMetric = props.params.defaultGroupByMetric;
  const defaultSubgroupBy = props.params.defaultSubgroupBy;

  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <FundBreakdownTableWidget
            defaultGroupByMetric={defaultGroupByMetric}
            defaultSubgroupBy={defaultSubgroupBy}
          />
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const AnalystBreakdownTable = React.memo(
  (props: IDockviewPanelProps) => {
    const primaryMetrics = props.params.primaryMetrics || [];
    const primaryGroupByMetrics = props.params.primaryGroupByMetrics || [];
    const secondaryMetrics = props.params.secondaryMetrics || [];
    const benchmarkIds = props?.params?.benchmarkIds || [];
    const secondaryGroupByMetrics = props.params.secondaryGroupByMetrics || [];
    const defaultSortDirection = props.params.defaultSortDirection;

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <AnalystBreakdownTableWidget
              primaryMetrics={primaryMetrics}
              primaryGroupByMetrics={primaryGroupByMetrics}
              secondaryMetrics={secondaryMetrics}
              secondaryGroupByMetrics={secondaryGroupByMetrics}
              benchmarkIds={benchmarkIds}
              defaultSortDirection={defaultSortDirection}
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);
