import { withAppInsights } from "@/modules/app-insights/hocs/withAppInsights";
import { PortfolioSummaryContent } from "./components/PortfolioSummaryContent";

export const PortfolioSummary = withAppInsights(
  PortfolioSummaryContent,
  "PortfolioSummary"
);
