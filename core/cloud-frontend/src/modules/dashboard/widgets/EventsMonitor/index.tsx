import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { EventsMonitorContent } from "./components/EventsMonitorContent";

export const EventsMonitor = withAppInsights(
  EventsMonitorContent,
  "EventsMonitor"
);
