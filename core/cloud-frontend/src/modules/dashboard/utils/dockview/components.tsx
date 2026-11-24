import { IDockviewPanelProps } from "dockview-react";
import React from "react";
import { QueryLocalFiltersProvider } from "@/providers/LocalFiltersProvider";
import { QueryLocalYearProvider } from "@/providers/LocalYearProvider";
import { BattingAndSluggingTable as BattingAndSluggingTableWidget } from "@/modules/dashboard/widgets/BattingAndSluggingTable";
import { EmbedWidget } from "@/modules/dashboard/widgets/EmbedWidget";
import { FundBreakdownTable as FundBreakdownTableWidget } from "@/modules/dashboard/widgets/FundBreakdownTable";
import { LiquiditySummaryTable } from "@/modules/dashboard/widgets/LiquiditySummaryTable";
import { MarketCapDistributionTable as MarketCapDistributionTableWidget } from "@/modules/dashboard/widgets/MarketCapDistributionTable";
import { MetricCards as MetricCardsWidget } from "@/modules/dashboard/widgets/MetricCards";
import { MonthlyPerformance as MonthlyPerformanceTable } from "@/modules/dashboard/widgets/MonthlyPerformance";
import { PerformanceOverviewOptimized as PerformanceOverviewOptimizedWidget } from "@/modules/dashboard/widgets/PerformanceOverviewOptimized";
import { PerformanceDistribution as PerformanceDistributionWidget } from "@/modules/dashboard/widgets/PerformanceDistribution";
import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
import { WinnersAndLosers as WinnersAndLosersWidget } from "@/modules/dashboard/widgets/WinnersAndLosers";
import ErrorBoundary from "@/components/ErrorBoundary";
import { PanelProvider } from "@/providers/PanelProvider";
import { CreditSummaryTable as CreditSummaryTableWidget } from "@/modules/dashboard/widgets/CreditSummaryTable";
import { EventLogsTable as EventLogsTableWidget } from "@/modules/dashboard/widgets/EventLogsTable";
import { PerformanceSummary as PerformanceSummaryWidget } from "@/modules/dashboard/widgets/PerformanceSummary";
import { CreditCrosswalkTable } from "@/modules/dashboard/widgets/CreditCrosswalkTable";
import { PortfolioSummary as PortfolioSummaryWidget } from "@/modules/dashboard/widgets/PortfolioSummary";
import { FundSummaryTable as FundSummaryTableWidget } from "@/modules/dashboard/widgets/FundSummary";
import { AnalystBreakdownTable as AnalystBreakdownTableWidget } from "@/modules/dashboard/widgets/AnalystBreakdownTable";
import { PositionDifferencesTable as PositionDifferencesTableWidget } from "@/modules/dashboard/widgets/PositionDifferencesTable";
import { CoverageUniverse as CoverageUniverseWidget } from "@/modules/dashboard/widgets/CoverageUniverse";
import { mapFiltersToCompanyFilters } from "../../widgets/CoverageUniverse/helpers/filters";
import { CoverageDistribution as CoverageDistributionWidget } from "@/modules/dashboard/widgets/CoverageDistribution";
import { EventsWidget } from "../../widgets/EventsWidget";
import { CoverageCalendar as CoverageCalendarWidget } from "@/modules/dashboard/widgets/CoverageCalendar";
import { EventsMonitor as EventTrackerWidget } from "@/modules/dashboard/widgets/EventsMonitor";

export const MetricCards = React.memo((props: IDockviewPanelProps) => {
  const metrics = props?.params?.metricsSettings || [];

  const isDynamicFontColoringEnabled =
    props?.params?.dynamicFontColoringSettings?.isDynamicFontColoringEnabled;

  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <div className="flex h-fit w-full gap-3">
            <MetricCardsWidget
              metrics={metrics}
              isDynamicFontColoringEnabled={isDynamicFontColoringEnabled}
            />
          </div>
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const CoverageCalendar = React.memo((props: IDockviewPanelProps) => {
  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <CoverageCalendarWidget />
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const PositionDifferencesTable = React.memo(
  (props: IDockviewPanelProps) => {
    const metrics = props.params.columnSettings.metrics || [];
    const groupByMetrics = props.params.groupBySettings.groupByMetrics || [];
    const defaultFilters = props.params.filterSettings?.filters || {};
    const fundNames = props.params.fundSettings.fundNames || [];
    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <PositionDifferencesTableWidget
              metrics={metrics}
              groupByMetrics={groupByMetrics}
              defaultFilters={defaultFilters}
              fundNames={fundNames}
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const CoverageMonitorTable = React.memo((props: IDockviewPanelProps) => {
  const defaultFilters = props.params.filterSettings?.filters || {};
  const metrics = props.params?.columnSettings?.metrics || [];

  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <CoverageUniverseWidget
            defaultFilter={defaultFilters}
            metrics={metrics}
          />
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const CoverageDistribution = React.memo((props: IDockviewPanelProps) => {
  const defaultMetric = props.params.columnSettings.metric;
  const defaultFilters = mapFiltersToCompanyFilters(
    props.params.filterSettings?.filters
  );

  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <CoverageDistributionWidget
            defaultMetric={defaultMetric}
            defaultAdvancedFilter={defaultFilters}
          />
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const EventsTable = React.memo((props: IDockviewPanelProps) => {
  const { flagSettings } = props.params;

  const additionalMetricFlags = {
    actual_nav_impact_min_threshold:
      flagSettings.actual_nav_impact_min_threshold ? 0.005 : undefined,
  };

  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <EventsWidget additionalMetricFlags={additionalMetricFlags} />
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const EventsStats = React.memo((props: IDockviewPanelProps) => {
  const { flagSettings } = props.params;

  const additionalMetricFlags = {
    actual_nav_impact_min_threshold:
      flagSettings.actual_nav_impact_min_threshold ? 0.005 : undefined,
  };
  const metrics = props?.params?.columnSettings?.metrics || [];

  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <div className="flex h-fit w-full gap-3">
            <MetricCardsWidget
              metrics={metrics}
              additionalMetricFlags={additionalMetricFlags}
              isEventAPI={true}
              isDynamicFontColoringEnabled={true}
            />
          </div>
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const EventTracker = React.memo((props: IDockviewPanelProps) => {
  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <EventTrackerWidget />
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const PortfolioSummary = React.memo((props: IDockviewPanelProps) => {
  const defaultSubgroupBy =
    props?.params?.nestedRowSettings?.defaultSubgroupBy || "";
  const defaultSubgroupByFallback =
    props?.params?.nestedRowSettings?.defaultSubgroupByFallback || "";
  const metrics = props?.params?.columnSettings?.otherColumnOptions || [];
  const defaultMetrics = props?.params?.columnSettings?.defaultColumns || [];

  const groupByMetrics =
    props?.params?.groupBySettings?.otherGroupByOptions || [];

  const defaultGroupByMetric =
    groupByMetrics.length > 0 ? groupByMetrics[0] : "";

  const defaultSortByMetric =
    props?.params?.sortBySettings?.defaultSortByMetric || "";
  const defaultSortDirection =
    props?.params?.sortBySettings?.defaultSortDirection || "";
  const defaultFilters = props?.params?.filterSettings?.filters || {};

  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <PortfolioSummaryWidget
            metrics={metrics}
            defaultMetrics={defaultMetrics}
            groupByMetrics={groupByMetrics}
            defaultGroupByMetric={defaultGroupByMetric}
            defaultSubgroupBy={defaultSubgroupBy}
            defaultSubgroupByFallback={defaultSubgroupByFallback}
            defaultSortByMetric={defaultSortByMetric}
            defaultSortDirection={defaultSortDirection}
            defaultFilters={defaultFilters}
          />
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

export const WinnersAndLosers = React.memo((props: IDockviewPanelProps) => {
  const sortByMetric = props?.params?.sortBySettings?.sortByMetric || "";
  const groupByMetrics =
    props?.params?.groupBySettings?.otherGroupByOptions || [];
  const defaultGroupByMetric =
    groupByMetrics.length > 0 ? groupByMetrics[0] : "";

  const defaultSubgroupBy =
    props?.params?.nestedRowSettings?.defaultSubgroupBy || "";
  const defaultSubgroupByFallback =
    props?.params?.nestedRowSettings?.defaultSubgroupByFallback || "";
  const groupByTop = props?.params?.pageSizeSettings?.groupByTop || [];

  const defaultFilters = props?.params?.filterSettings?.filters || {};
  const showGroupBySelect =
    props?.params?.groupBySettings?.showGroupBySelect || false;

  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <WinnersAndLosersWidget
            sortByMetric={sortByMetric}
            groupByTop={groupByTop}
            groupByMetrics={groupByMetrics}
            defaultGroupByMetric={defaultGroupByMetric}
            defaultSubgroupBy={defaultSubgroupBy}
            defaultSubgroupByFallback={defaultSubgroupByFallback}
            defaultFilters={defaultFilters}
            showGroupBySelect={showGroupBySelect}
          />
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const PerformanceDistribution = React.memo(
  (props: IDockviewPanelProps) => {
    const groupByMetrics =
      props?.params?.groupBySettings?.otherGroupByOptions || [];
    const defaultGroupByMetric =
      groupByMetrics.length > 0 ? groupByMetrics[0] : "";

    const colorMetric = props?.params?.dataSettings?.colorMetric || "";

    const defaultSubgroupBy =
      props?.params?.groupBySettings?.defaultSubgroupBy || "";
    const sizeMetric = props?.params?.dataSettings?.sizeMetric || "";

    const defaultFilters = props?.params?.filterSettings?.filters || {};

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <PerformanceDistributionWidget
              groupByMetrics={groupByMetrics}
              defaultGroupByMetric={defaultGroupByMetric}
              defaultDisplayMetric={colorMetric}
              defaultSubgroupBy={defaultSubgroupBy}
              defaultSizeMetric={sizeMetric}
              defaultFilters={defaultFilters}
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const LiquiditySummary = React.memo((props: IDockviewPanelProps) => {
  const defaultMetrics = props?.params?.columnSettings?.defaultColumns || [];

  const defaultGroupByMetric =
    props?.params?.groupBySettings?.defaultGroupBy || "";
  const defaultSubgroupBy =
    props?.params?.groupBySettings?.defaultSubgroupBy || "";

  const defaultFilters = props?.params?.filterSettings?.filters || {};

  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <LiquiditySummaryTable
            defaultMetrics={defaultMetrics}
            defaultGroupByMetric={defaultGroupByMetric}
            defaultSubgroupBy={defaultSubgroupBy}
            defaultFilters={defaultFilters}
          />
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const MarketCapDistributionTable = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultMetrics = props?.params?.columnSettings?.defaultColumns || [];

    const defaultGroupByMetric =
      props?.params?.groupBySettings?.defaultGroupBy || "";
    const defaultSubgroupBy =
      props?.params?.groupBySettings?.defaultSubgroupBy || "";

    const defaultFilters = props?.params?.filterSettings?.filters || {};

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <MarketCapDistributionTableWidget
              defaultGroupByMetric={defaultGroupByMetric}
              defaultFilters={defaultFilters}
              defaultMetrics={defaultMetrics}
              defaultSubgroupBy={defaultSubgroupBy}
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const FundBreakdownTable = React.memo((props: IDockviewPanelProps) => {
  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <FundBreakdownTableWidget />
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

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

export const AnalystBreakdownTable = React.memo(
  (props: IDockviewPanelProps) => {
    const primaryMetrics = props.params.columnSettings.primaryMetrics || [];
    const primaryGroupByMetrics =
      props.params.groupBySettings.primaryGroupByMetrics || [];
    const secondaryMetrics = props.params.columnSettings.secondaryMetrics || [];
    const secondaryGroupByMetrics =
      props.params.groupBySettings.secondaryGroupByMetrics || [];

    const defaultSortDirection = props.params.sortSettings.defaultSortDirection;
    const benchmarkIds: string[] = [];
    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <AnalystBreakdownTableWidget
              benchmarkIds={benchmarkIds}
              primaryMetrics={primaryMetrics}
              primaryGroupByMetrics={primaryGroupByMetrics}
              secondaryMetrics={secondaryMetrics}
              secondaryGroupByMetrics={secondaryGroupByMetrics}
              defaultSortDirection={defaultSortDirection}
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const Embed = React.memo((props: IDockviewPanelProps) => {
  const url = props?.params?.url;
  const cardName = props?.params?.cardName;

  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <EmbedWidget src={url} cardName={cardName} />
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const BattingAndSluggingTable = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultSortByMetric =
      props?.params?.sortBySettings?.defaultSortBy || "";
    const defaultSortDirection =
      props?.params?.sortBySettings?.defaultSortDirection || "";

    const defaultMetrics = props?.params?.columnSettings?.defaultMetrics || [];

    const defaultFilters = props?.params?.filterSettings?.filters || {};

    const groupByMetrics =
      props?.params?.groupBySettings?.otherGroupByOptions || [];

    const defaultGroupByMetric =
      groupByMetrics.length > 0 ? groupByMetrics[0] : "";

    return (
      <PanelProvider value={props}>
        <ErrorBoundary>
          <QueryLocalFiltersProvider>
            <BattingAndSluggingTableWidget
              defaultMetrics={defaultMetrics}
              groupByMetrics={groupByMetrics}
              defaultSortByMetric={defaultSortByMetric}
              defaultSortDirection={defaultSortDirection as "desc" | "asc"}
              defaultGroupByMetric={defaultGroupByMetric}
              defaultFilters={defaultFilters}
            />
          </QueryLocalFiltersProvider>
        </ErrorBoundary>
      </PanelProvider>
    );
  }
);

export const MonthlyPerformance = React.memo((props: IDockviewPanelProps) => {
  const totalMetric = props?.params?.columnSettings?.totalMetric || "";

  const groupByMetrics =
    props?.params?.groupBySettings?.otherGroupByOptions || [];
  const defaultGroupByMetric =
    groupByMetrics.length > 0 ? groupByMetrics[0] : "";

  const defaultFilters = props?.params?.filterSettings?.filters || {};

  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <QueryLocalYearProvider>
            <MonthlyPerformanceTable
              totalMetric={totalMetric}
              groupByMetrics={groupByMetrics}
              defaultGroupByMetric={defaultGroupByMetric}
              defaultFilters={defaultFilters}
            />
          </QueryLocalYearProvider>
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const CreditCrosswalk = React.memo((props: IDockviewPanelProps) => {
  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <CreditCrosswalkTable />
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const CreditSummaryTable = React.memo((props: IDockviewPanelProps) => {
  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <CreditSummaryTableWidget />
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const EventLogsTable = React.memo((props: IDockviewPanelProps) => {
  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <EventLogsTableWidget />
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const PerformanceSummary = React.memo((props: IDockviewPanelProps) => {
  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <PerformanceSummaryWidget />
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});
