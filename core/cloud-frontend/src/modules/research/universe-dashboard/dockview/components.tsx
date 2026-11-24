import { IDockviewPanelProps } from "dockview-react";
import React from "react";

import { CompanyCatalogRequestFilters } from "@/api/types";
import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
import { CoverageDistribution as CoverageDistributionWidget } from "@/modules/dashboard/widgets/CoverageDistribution";
import { CoverageMonitorWinnersAndLosers as CoverageMonitorWinnersAndLosersWidget } from "@/modules/dashboard/widgets/CoverageMonitorWinnersAndLosers";
import { CoverageUniverse as CoverageUniverseWidget } from "@/modules/dashboard/widgets/CoverageUniverse";
import { WinnersAndLosers as WinnersAndLosersWidget } from "@/modules/dashboard/widgets/WinnersAndLosers";
import { UniverseDashboardStats as UniverseDashboardStatsWidget } from "@/modules/dashboard/widgets/UniverseDashboardStats";
import { PanelProvider } from "@/providers/PanelProvider";
import { QueryLocalFiltersProvider } from "@/providers/LocalFiltersProvider";
import { TimeSeriesChart as TimeSeriesChartWidget } from "@/modules/dashboard/widgets/TimeSeriesChart";

export const CoverageMonitorTable = React.memo((props: IDockviewPanelProps) => {
  const defaultAdvancedFilter: CompanyCatalogRequestFilters[] = props.params
    ?.filter?.hiddenFilters
    ? [props.params?.filter?.hiddenFilters]
    : [];

  const metrics = props.params?.metrics;

  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <CoverageUniverseWidget
            defaultAdvancedFilter={defaultAdvancedFilter}
            metrics={metrics}
          />
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const CoverageDistribution = React.memo((props: IDockviewPanelProps) => {
  const defaultMetric = props.params.defaultMetric;
  const defaultAdvancedFilter = props.params?.filter?.hiddenFilters
    ? [props.params?.filter?.hiddenFilters]
    : [];

  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <CoverageDistributionWidget
            defaultMetric={defaultMetric}
            defaultAdvancedFilter={defaultAdvancedFilter}
          />
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const CoverageMonitorWinnersAndLosers = React.memo(
  (props: IDockviewPanelProps) => {
    const groupByTop = props.params.groupByTop;
    const sortByMetric = props.params.sortByMetric;
    const filter: CompanyCatalogRequestFilters =
      props.params?.filter?.hiddenFilters || null;

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <CoverageMonitorWinnersAndLosersWidget
              groupByTop={groupByTop}
              sortByMetric={sortByMetric}
              filter={filter}
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const WinnersAndLosers = React.memo((props: IDockviewPanelProps) => {
  const sortByMetric = props.params.sortByMetric;
  const groupByTop = props.params.groupByTop;
  const groupByMetrics = props.params.groupByMetrics;
  const defaultGroupByMetric = props.params.defaultGroupByMetric;

  const defaultSubgroupBy = props.params.defaultSubgroupBy;
  const defaultSubgroupByFallback = props.params.defaultSubgroupByFallback;
  const showGroupBySelect = props.params.showGroupBySelect;

  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <WinnersAndLosersWidget
          disableFilters
          sortByMetric={sortByMetric}
          groupByTop={groupByTop}
          groupByMetrics={groupByMetrics}
          defaultGroupByMetric={defaultGroupByMetric}
          defaultSubgroupBy={defaultSubgroupBy}
          defaultSubgroupByFallback={defaultSubgroupByFallback}
          showGroupBySelect={showGroupBySelect}
          showFilters={false}
        />
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const UniverseDashboardStats = React.memo(
  (props: IDockviewPanelProps) => {
    const includes = props.params?.includes;
    const defaultFilters: CompanyCatalogRequestFilters[] = props.params?.filter
      ?.hiddenFilters
      ? [props.params?.filter?.hiddenFilters]
      : [];

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <UniverseDashboardStatsWidget
            includes={includes}
            defaultFilters={defaultFilters}
          />
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const TimeSeriesChart = React.memo((props: IDockviewPanelProps) => {
  const defaultFilters: CompanyCatalogRequestFilters[] = props.params?.filter
    ?.hiddenFilters
    ? [props.params?.filter?.hiddenFilters]
    : [];

  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <TimeSeriesChartWidget defaultFilters={defaultFilters} />
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});
