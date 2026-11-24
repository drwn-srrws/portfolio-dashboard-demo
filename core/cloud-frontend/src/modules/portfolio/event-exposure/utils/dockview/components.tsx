import { IDockviewPanelProps } from "dockview-react";
import React from "react";
import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
import { EventsWidget } from "@/modules/dashboard/widgets/EventsWidget";
import { MetricCards as MetricCardsWidget } from "@/modules/dashboard/widgets/MetricCards";
import { PanelProvider } from "@/providers/PanelProvider";
import { useEventMetricFilter } from "../../providers/EventMetricFilterContext";
import { QueryLocalFiltersProvider } from "@/providers/LocalFiltersProvider";

export const Events = React.memo((props: IDockviewPanelProps) => {
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
          <EventsWidget additionalMetricFlags={additionalMetricFlags} />
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const MetricCards = React.memo((props: IDockviewPanelProps) => {
  const { eventMetricFilters } = useEventMetricFilter();

  const metrics = props?.params?.metrics || [];

  const additionalMetricFlags = {
    actual_nav_impact_min_threshold: eventMetricFilters.enable_low_impact_filter
      ? 0.005
      : undefined,
  };

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
