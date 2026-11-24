import type { Config } from "./types";

import { baseConfig } from "./base/base-config";
import { metadata } from "./base/metadata";
import { analytics } from "./base/analytics";
import { defaultRecentlyViewedPages } from "./base/default-recently-viewed-pages";

import { admin } from "./admin/admin";

import { featureFlags } from "./feature-flags/feature-flags";
import { featureDialogs } from "./feature-flags/feature-dialogs";

import { navItems } from "./nav-items/nav-items";

import { pages } from "./pages/pages";

import { platformHomepagePanelConfig } from "./panel-configs/platform-homepage";
import { portfolioSummaryPagePanelConfig } from "./panel-configs/portfolio-summary";
import { portfolioSummaryOptimizedPagePanelConfig } from "./panel-configs/portfolio-summary-optimized";
import { portfolioPositionExposurePagePanelConfig } from "./panel-configs/portfolio-position-exposure";
import { portfolioPositionExposureOptimizedPagePanelConfig } from "./panel-configs/portfolio-position-exposure-optimized";
import { portfolioPositionDifferencesPagePanelConfig } from "./panel-configs/portfolio-position-differences";
import { portfolioPositionDifferencesOptimizedPagePanelConfig } from "./panel-configs/portfolio-position-differences-optimized";
import { portfolioHeatMapsPagePanelConfig } from "./panel-configs/portfolio-heat-maps";
import { portfolioAnalystOverviewPanelConfig } from "./panel-configs/portfolio-analyst-overview";
import { portfolioAnalystOverviewOptimizedPagePanelConfig } from "./panel-configs/portfolio-analyst-overview-optimized";
import { portfolioPerformanceSummaryPagePanelConfig } from "./panel-configs/portfolio-performance-summary";
import { portfolioPerformanceSummaryOptimizedPagePanelConfig } from "./panel-configs/portfolio-performance-summary-optimized";
import { portfolioPerformanceSummaryIIPagePanelConfig } from "./panel-configs/portfolio-performance-summary-ii";
import { portfolioHistoricalPerformancePagePanelConfig } from "./panel-configs/portfolio-historical-performance";
import { portfolioHistoricalPerformanceOptimizedPagePanelConfig } from "./panel-configs/portfolio-historical-performance-optimized";
import { portfolioEventExposurePagePanelConfig } from "./panel-configs/portfolio-event-exposure";
import { coverageUniversePagePanelConfig } from "./panel-configs/coverage-universe";
import { coverageMonitorPagePanelConfig } from "./panel-configs/coverage-monitor";
import { universeDashboardPagePanelConfig } from "./panel-configs/universe-dashboard";
import { portfolioBasketBreakdownPagePanelConfig } from "./panel-configs/portfolio-basket-breakdown";
import { portfolioBasketBreakdownOptimizedPagePanelConfig } from "./panel-configs/portfolio-basket-breakdown-optimized";
import { alphaAnalysisPagePanelConfig } from "./panel-configs/alpha-analysis";
import { alphaAnalysisOptimizedPagePanelConfig } from "./panel-configs/alpha-analysis-optimized";
import { portfolioLtdAlphaPagePanelConfig } from "./panel-configs/portfolio-ltd-alpha";
import { portfolioLtdAlphaTwoPagePanelConfig } from "./panel-configs/portfolio-ltd-alpha-two";
import { companyPanelConfig } from "./panel-configs/company-page";
import { securityManagerPagePanelConfig } from "./panel-configs/security-manager";
import { portfolioAssistantPagePanelConfig } from "./panel-configs/portfolio-assistant";

export const config: Config = {
  ...baseConfig,
  metadata,
  analytics,
  defaultRecentlyViewedPages,
  admin,
  featureFlags,
  featureDialogs,
  navItems,
  pages,

  platformHomepagePanelConfig,
  portfolioSummaryPagePanelConfig,
  portfolioSummaryOptimizedPagePanelConfig,
  portfolioPositionExposurePagePanelConfig,
  portfolioPositionExposureOptimizedPagePanelConfig,
  portfolioPositionDifferencesPagePanelConfig,
  portfolioPositionDifferencesOptimizedPagePanelConfig,
  portfolioHeatMapsPagePanelConfig,
  portfolioAnalystOverviewPanelConfig,
  portfolioAnalystOverviewOptimizedPagePanelConfig,
  portfolioPerformanceSummaryPagePanelConfig,
  portfolioPerformanceSummaryOptimizedPagePanelConfig,
  portfolioPerformanceSummaryIIPagePanelConfig,
  portfolioHistoricalPerformancePagePanelConfig,
  portfolioHistoricalPerformanceOptimizedPagePanelConfig,
  portfolioEventExposurePagePanelConfig,
  coverageUniversePagePanelConfig,
  coverageMonitorPagePanelConfig,
  universeDashboardPagePanelConfig,
  portfolioBasketBreakdownPagePanelConfig,
  portfolioBasketBreakdownOptimizedPagePanelConfig,
  alphaAnalysisPagePanelConfig,
  alphaAnalysisOptimizedPagePanelConfig,
  portfolioLtdAlphaPagePanelConfig,
  portfolioLtdAlphaTwoPagePanelConfig,
  companyPanelConfig,
  securityManagerPagePanelConfig,
  portfolioAssistantPagePanelConfig,
};

export type {
  Config,
  BaseConfig,
  FeatureFlags,
  FeatureFlagName,
  FeatureDialogConfig,
  AdminLink,
  AdminLinkGroup,
  AdminLinkCard,
  MenuItem,
  Group,
} from "./types";
export type { PanelConfig } from "./shared-types";
