import { ChangeHistoryConfig } from "../../../providers/ChangeHistoryProvider";

export interface CoverageUniverseCacheFlags extends Record<string, boolean> {
  main: boolean;
}

export const coverageUniverseHistoryConfig: ChangeHistoryConfig<
  string,
  Record<string, boolean>
> = {
  initialFlags: {
    main: false,
  } satisfies CoverageUniverseCacheFlags,
  entityToFlags: (entity: string) => {
    switch (entity) {
      case "rating":
      case "primary_analyst":
      case "secondary_analysts":
      case "research_analysts":
      case "upside_price_target":
      case "downside_price_target":
      case "workflow_status":
        return ["main"];
      default:
        return [];
    }
  },
};
