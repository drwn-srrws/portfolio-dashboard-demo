import React from "react";
import { CoverageMonitorWinnersAndLosers as CoverageMonitorWinnersAndLosersWidget } from "@/modules/dashboard/widgets/CoverageMonitorWinnersAndLosers";
import { IDockviewPanelProps } from "dockview-react";
import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
import { PanelProvider } from "@/providers/PanelProvider";
import { QueryLocalFiltersProvider } from "@/providers/LocalFiltersProvider";
import { UpcomingEvents as UpcomingEventsWidget } from "@/modules/platform-homepage/components/UpcomingEvents";
import { useEventMetricFilter } from "@/modules/portfolio/event-exposure/providers/EventMetricFilterContext";
import { TradingTickerCards as TradingTickerCardsWidget } from "../../components/TradingTickerCards";
import { CompanyCatalogRequestFilters } from "@/api/types";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

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

export const UpcomingEvents = React.memo((props: IDockviewPanelProps) => {
  const { eventMetricFilters } = useEventMetricFilter();

  const additionalMetricFlags = {
    actual_nav_impact_min_threshold: eventMetricFilters.enable_low_impact_filter
      ? 0.005
      : undefined,
  };

  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <UpcomingEventsWidget additionalMetricFlags={additionalMetricFlags} />
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const TradingTickerCards = React.memo((props: IDockviewPanelProps) => {
  const { isFeatureEnabled } = useFeatureFlags();
  const isTrendingTickersEnabled = isFeatureEnabled("enableTrendingTickers");

  if (!isTrendingTickersEnabled) return null;

  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <div className="flex h-fit w-full gap-3">
            <TradingTickerCardsWidget />
          </div>
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});
