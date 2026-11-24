import { withAppInsights } from "@/modules/app-insights/hocs/withAppInsights";
import { AlphaAnalystBreakdownTableContent } from "./AlphaAnalystBreakdownTableContent";

export const AlphaAnalystBreakdownTable = withAppInsights(
  AlphaAnalystBreakdownTableContent,
  "AlphaAnalystBreakdownTable"
);
