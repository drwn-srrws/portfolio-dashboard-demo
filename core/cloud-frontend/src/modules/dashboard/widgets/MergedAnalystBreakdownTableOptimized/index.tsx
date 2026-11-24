import { withAppInsights } from "@/modules/app-insights/hocs/withAppInsights";
import {
  MergedAnalystBreakdownTableContent,
  MergedAnalystBreakdownTableContentProps,
} from "./MergedAnalystBreakdownTableContent";

export type { MergedAnalystBreakdownTableContentProps as MergedAnalystBreakdownTableProps };

export const MergedAnalystBreakdownTable = withAppInsights(
  MergedAnalystBreakdownTableContent,
  "MergedAnalystBreakdownTable"
);
