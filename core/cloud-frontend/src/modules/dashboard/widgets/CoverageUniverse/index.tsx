import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { CoverageUniverseContent } from "./components/CoverageUniverseContent";

export const CoverageUniverse = withAppInsights(
  CoverageUniverseContent,
  "CoverageUniverse"
);
