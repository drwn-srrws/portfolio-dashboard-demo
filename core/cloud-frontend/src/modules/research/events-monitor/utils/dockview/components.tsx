import { IDockviewPanelProps } from "dockview-react";
import React from "react";

import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
import { EventsMonitor as EventsMonitorWidget } from "@/modules/dashboard/widgets/EventsMonitor";
import { PanelProvider } from "@/providers/PanelProvider";
import { QueryLocalFiltersProvider } from "@/providers/LocalFiltersProvider";
import { ChangeHistoryProvider } from "@/modules/dashboard/providers/ChangeHistoryProvider";
import { eventsMonitorHistoryConfig } from "@/modules/dashboard/widgets/EventsMonitor/configs/eventsMonitorHistoryConfig";

export const EventsMonitorTable = React.memo((props: IDockviewPanelProps) => {
  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <ChangeHistoryProvider
          config={eventsMonitorHistoryConfig}
          localStorageKey="events-monitor-history"
        >
          <QueryLocalFiltersProvider>
            <EventsMonitorWidget />
          </QueryLocalFiltersProvider>
        </ChangeHistoryProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});
