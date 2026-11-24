import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { CoverageDistributionContent } from "./components/CoverageDistributionContent";

export const CoverageDistribution = withAppInsights(
  CoverageDistributionContent,
  "CoverageDistribution"
);
