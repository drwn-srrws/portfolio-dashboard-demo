import { SecurityManagerTab } from "@/modules/data-manager/main/security-manager/types/SecurityManagerTab";

import { PortfolioSummaryOptimizedPage } from "../modules/portfolio/summary-optimized";
import { PrivatePortfolioPage } from "../modules/portfolio/private-portfolio";
import { EventExposurePage } from "../modules/portfolio/event-exposure";
import { PerformanceSummaryOptimizedPage } from "../modules/portfolio/performance-summary-optimized";
import { PerformanceSummaryIIPage } from "../modules/portfolio/performance-summary-ii";
import { PositionExposureOptimizedPage } from "../modules/portfolio/position-exposure-optimized";
import { PositionDifferencesOptimizedPage } from "../modules/portfolio/position-differences-optimized";
import { HeatMapsOptimizedPage } from "../modules/portfolio/heat-maps-optimized";
import { DataManagerCoveragePage } from "../modules/data-manager/coverage";
import { ObservabilityPage } from "../modules/operations/observability";
import { EventTrackerNewPage } from "@/modules/research/events-monitor";
import { PlatformHomepage } from "@/modules/platform-homepage";
import { AnalystOverviewOptimizedPage } from "@/modules/portfolio/analyst-overview-optimized";
import { AssistantOverviewPage } from "@/modules/portfolio/assistant-overview";
import { BasketBreakdownOptimizedPage } from "@/modules/portfolio/basket-breakdown-optimized";
import { AlphaAnalysisOptimizedPage } from "@/modules/portfolio/alpha-analysis-optimized";
import { HistoricalPerformanceOptimizedPage } from "@/modules/portfolio/historical-performance-optimized";
import { LtdAlphaTwoPage } from "@/modules/portfolio/ltd-alpha-two";
import { CoverageUniversePage } from "@/modules/research/coverage-universe";
import { CoverageMonitorPage } from "@/modules/research/coverage-monitor";
import { UniverseDashboardPage } from "@/modules/research/universe-dashboard";
import { Companies } from "@/modules/data-manager/main/security-manager/pages/Companies";
import { Securities } from "@/modules/data-manager/main/security-manager/pages/Securities";
import { InstrumentGroups } from "@/modules/data-manager/main/security-manager/pages/InstrumentGroups";

export const mapRouteToElement = {
  "/portfolio/basket-breakdown": <BasketBreakdownOptimizedPage />,
  "/portfolio/event-exposure": <EventExposurePage />,
  "/portfolio/historical-performance": <HistoricalPerformanceOptimizedPage />,
  "/portfolio/performance-summary": <PerformanceSummaryOptimizedPage />,
  "/portfolio/performance-summary-two": <PerformanceSummaryIIPage />,
  "/portfolio/alpha-analysis": <AlphaAnalysisOptimizedPage />,
  "/portfolio/ltd-alpha": <LtdAlphaTwoPage />,
  "/portfolio/position-exposure": <PositionExposureOptimizedPage />,
  "/portfolio/position-differences": <PositionDifferencesOptimizedPage />,
  "/portfolio/heat-maps": <HeatMapsOptimizedPage />,
  "/portfolio/summary": <PortfolioSummaryOptimizedPage />,
  "/portfolio/private-portfolio": <PrivatePortfolioPage />,
  "/portfolio/analyst-overview": <AnalystOverviewOptimizedPage />,
  "/portfolio/assistant-overview": <AssistantOverviewPage />,
  "/research/event-tracker-new": <EventTrackerNewPage />,
  "/data-manager/coverage": <DataManagerCoveragePage />,
  "/operations/observability": <ObservabilityPage />,
  "/platform-homepage": <PlatformHomepage />,
  "/research/universe-dashboard": <UniverseDashboardPage />,
  "/research/coverage-universe": <CoverageUniversePage />,
  "/research/coverage-monitor": <CoverageMonitorPage />,
  "/data-manager/security-manager": <Securities />,
  "/data-manager/security-manager/companies": <Companies />,
  "/data-manager/security-manager/instrument-groups": <InstrumentGroups />,
  "/data-manager/security-manager/securities": <Securities />,
};

export const routes = {
  login: () => "/login",
  riskFactorization: () => "/portfolio/risk-factorization",
  eventExposure: () => "/portfolio/event-exposure",
  historicalPerformance: () => "/portfolio/historical-performance",
  performanceSummary: () => "/portfolio/performance-summary",
  performanceSummaryII: () => "/portfolio/performance-summary-two",
  ltdAlpha: () => "/portfolio/ltd-alpha",
  positionExposure: () => "/portfolio/position-exposure",
  positionDifferences: () => "/portfolio/position-differences",
  heatMaps: () => "/portfolio/heat-maps",
  portfolioSummary: () => "/portfolio/summary",
  analystOverview: () => "/portfolio/analyst-overview",
  assistantOverview: () => "/portfolio/assistant-overview",
  basketBreakdown: () => "/portfolio/basket-breakdown",
  alphaAnalysis: () => "/portfolio/alpha-analysis",
  universeDashboard: () => "/research/universe-dashboard",
  coverageUniverse: () => "/research/coverage-universe",
  coverageMonitor: () => "/research/coverage-monitor",
  eventTrackerNew: () => "/research/event-tracker-new",
  dataManagerCoverage: () => "/data-manager/coverage",
  observabilityPage: () => "/operations/observability",
  securityManager: (tab?: SecurityManagerTab) =>
    `/data-manager/security-manager/${tab}`,
  company: (id: string) => `/company/${id}`,
  dataIntegrityReview: () => `/data-integrity/review`,
  coDashboard: () => "/research/co-dashboard",
  drugDetail: (drugName: string) => `/drugs/${drugName}`,
  homePage: () => "/",
  unauthorized: () => "/unauthorized",
};
