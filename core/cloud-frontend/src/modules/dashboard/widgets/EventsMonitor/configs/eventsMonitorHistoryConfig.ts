import { ChangeHistoryConfig } from "../../../providers/ChangeHistoryProvider";

export interface EventsMonitorCacheFlags extends Record<string, boolean> {
  main: boolean;
  passedEvents: boolean;
  staleEstimates: boolean;
}

export const eventsMonitorHistoryConfig: ChangeHistoryConfig<
  string,
  Record<string, boolean>
> = {
  initialFlags: {
    main: false,
    passedEvents: false,
    staleEstimates: false,
  } satisfies EventsMonitorCacheFlags,
  entityToFlags: (entity: string) => {
    switch (entity) {
      case "batch_events":
        return ["passedEvents"];
      case "batch_estimates":
        return ["staleEstimates"];
      case "event":
      case "estimate":
      case "price_target":
      case "workstream":
      case "workflow_status":
        return ["main"];
      default:
        return [];
    }
  },
};
