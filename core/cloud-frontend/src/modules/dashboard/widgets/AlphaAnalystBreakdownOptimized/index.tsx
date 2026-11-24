import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";

import { AlphaAnalystBreakdownOptimizedContent } from "./AlphaAnalystBreakdownOptimizedContent";

export const AlphaAnalystBreakdownOptimized = withAppInsights(
  AlphaAnalystBreakdownOptimizedContent,
  "AlphaAnalystBreakdownOptimized"
);
