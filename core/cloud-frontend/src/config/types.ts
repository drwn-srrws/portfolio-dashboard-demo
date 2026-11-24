import { Dialogs } from "@/store/slices/dialogsSlice";
import { CompanyCatalogRequestFilters } from "@api/types";
import { BannerPlacement } from "@components/Banner/types/BannerPlacement";
import { BannerVariant } from "@components/Banner/types/BannerVariant";
import { IconNameType } from "@components/Icon/Icon";
import { NavItemGroup } from "@typings/NavItemGroup";
import { PanelConfig } from "./shared-types";

export interface AdminLink {
  text: string;
  url: string;
  icon: IconNameType;
}

export interface AdminLinkGroup {
  title: string;
  links: AdminLink[];
}

export interface AdminLinkCard {
  title: string;
  groups: AdminLinkGroup[];
}

export interface FeatureFlags {
  enabled: boolean;
  auth?: {
    allowedEmails?: string[];
    deniedEmails?: string[];
    allowedRoles: string[];
  };
}

export interface MenuItem {
  text: string;
  icon: IconNameType;
  dialog: `${Dialogs}`;
  componentName?: string;
  disabled?: boolean;
  tooltip?: string;
  preview?: {
    image?: string;
    text?: string;
  };
  disableDefaultValues?: boolean;
}

export interface Group {
  group: string;
  items: MenuItem[];
}

export type FeatureFlagName = keyof NonNullable<Config["featureFlags"]>;

export interface FeatureDialogConfig {
  key: string;
  title: string;
  description: string;
  pages?: string[];
  targetSelector?: string;
}

export type BaseConfig = Pick<
  Config,
  "hedClient" | "hedEnv" | "support" | "agGridLicenseKey"
>;

export interface Config {
  agGridLicenseKey: string;

  hedClient: string;

  support?: {
    email?: string;
  };

  featureDialogs?: FeatureDialogConfig[];

  pages?: {
    portfolioOverview?: {
      enableBasketExplosion: {
        enabled: boolean;
      };
    };
    portfolioSummary?: {
      defaultFilters?: {
        filters?: Record<string, string[]>;
      };
      userFilters?: {
        emails: string[];
        filters?: Record<string, string[]>;
      };
    };
    portfolioSummaryOptimized?: {
      defaultFilters?: {
        filters?: Record<string, string[]>;
      };
      userFilters?: {
        emails: string[];
        filters?: Record<string, string[]>;
      };
    };
    portfolioPositionExposure?: {
      defaultFilters?: {
        filters?: Record<string, string[]>;
      };
      userFilters?: {
        emails: string[];
        filters?: Record<string, string[]>;
      };
    };
    portfolioPositionDifferences?: {
      defaultFilters?: {
        filters?: Record<string, string[]>;
      };
      userFilters?: {
        emails: string[];
        filters?: Record<string, string[]>;
      };
    };
    portfolioPositionDifferencesOptimized?: {
      defaultFilters?: {
        filters?: Record<string, string[]>;
      };
      userFilters?: {
        emails: string[];
        filters?: Record<string, string[]>;
      };
    };
    portfolioHeatMaps?: {
      defaultFilters?: {
        filters?: Record<string, string[]>;
      };
      userFilters?: {
        emails: string[];
        filters?: Record<string, string[]>;
      };
    };
    portfolioPerformanceSummary?: {
      defaultFilters?: {
        filters?: Record<string, string[]>;
      };
      userFilters?: {
        emails: string[];
        filters?: Record<string, string[]>;
      };
    };
    portfolioHistoricalPerformance?: {
      showDatePicker?: boolean;
      defaultFilters?: {
        filters?: Record<string, string[]>;
      };
      userFilters?: {
        emails: string[];
        filters?: Record<string, string[]>;
      };
    };
    portfolioHistoricalPerformanceOptimized?: {
      defaultFilters?: {
        filters?: Record<string, string[]>;
      };
      userFilters?: {
        emails: string[];
        filters?: Record<string, string[]>;
      };
    };
    portfolioEventExposure?: {
      defaultFilters?: {
        filters?: Record<string, string[]>;
      };
      userFilters?: {
        emails: string[];
        filters?: Record<string, string[]>;
      };
    };
    portfolioAnalystOverview?: {
      defaultFilters?: {
        filters?: Record<string, string[]>;
      };
      userFilters?: {
        emails: string[];
        filters?: Record<string, string[]>;
      };
    };
    portfolioBasketBreakdown?: {
      defaultFilters?: {
        filters?: Record<string, string[]>;
      };
      userFilters?: {
        emails: string[];
        filters?: Record<string, string[]>;
      };
    };
    portfolioAlphaAnalysis?: {
      defaultFilters?: {
        filters?: Record<string, string[]>;
      };
      userFilters?: {
        emails: string[];
        filters?: Record<string, string[]>;
      };
    };
    portfolioLtdAlpha?: {
      showDatePicker?: boolean;
      defaultFilters?: {
        filters?: Record<string, string[]>;
      };
      userFilters?: {
        emails: string[];
        filters?: Record<string, string[]>;
      };
    };
    portfolioLtdAlphaOptimized?: {
      defaultFilters?: {
        filters?: Record<string, string[]>;
      };
      userFilters?: {
        emails: string[];
        filters?: Record<string, string[]>;
      };
    };
    coverageMonitor?: {
      hiddenFilters?: CompanyCatalogRequestFilters;
    };
    eventTrackerNew?: {
      defaultFilters?: {
        filters?: Record<string, string[]>;
      };
      userFilters?: {
        emails: string[];
        filters?: Record<string, string[]>;
      };
    };
  };

  navItems: NavItemGroup[];

  defaultRecentlyViewedPages: {
    url: string;
    title: string;
    icon?: IconNameType;
  }[];

  metadata: {
    title: string;
  };

  analytics: {
    connectionStringMap: Record<string, string>;
  };

  admin: {
    cards: AdminLinkCard[];
  };

  hedEnv: "localdev" | "staging" | "prod";

  banner?: {
    variant: BannerVariant;
    text: string;
    placement?: BannerPlacement;
  };
  featureFlags?: {
    enableEventTrackerChatbot?: FeatureFlags;
    enableBasketExplosion?: FeatureFlags;
    enableKgFeatures?: FeatureFlags;
    enableNewHomepage?: FeatureFlags;
    enableTrendingTickers?: FeatureFlags;
    enableIvolImpliedMove?: FeatureFlags;
  };
  platformHomepagePanelConfig: PanelConfig;
  portfolioSummaryPagePanelConfig: PanelConfig;
  portfolioSummaryOptimizedPagePanelConfig: PanelConfig;
  portfolioPositionExposurePagePanelConfig: PanelConfig;
  portfolioPositionExposureOptimizedPagePanelConfig: PanelConfig;
  portfolioPositionDifferencesPagePanelConfig: PanelConfig;
  portfolioPositionDifferencesOptimizedPagePanelConfig: PanelConfig;
  portfolioHeatMapsPagePanelConfig: PanelConfig;
  portfolioAnalystOverviewPanelConfig: PanelConfig;
  portfolioAnalystOverviewOptimizedPagePanelConfig: PanelConfig;
  portfolioPerformanceSummaryPagePanelConfig: PanelConfig;
  portfolioPerformanceSummaryOptimizedPagePanelConfig: PanelConfig;
  portfolioPerformanceSummaryIIPagePanelConfig: PanelConfig;
  portfolioHistoricalPerformancePagePanelConfig: PanelConfig;
  portfolioHistoricalPerformanceOptimizedPagePanelConfig: PanelConfig;
  portfolioEventExposurePagePanelConfig: PanelConfig;
  coverageUniversePagePanelConfig: PanelConfig;
  coverageMonitorPagePanelConfig: PanelConfig;
  universeDashboardPagePanelConfig: PanelConfig;
  portfolioBasketBreakdownPagePanelConfig: PanelConfig;
  portfolioBasketBreakdownOptimizedPagePanelConfig: PanelConfig;
  alphaAnalysisPagePanelConfig: PanelConfig;
  alphaAnalysisOptimizedPagePanelConfig: PanelConfig;
  portfolioLtdAlphaPagePanelConfig: PanelConfig;
  portfolioLtdAlphaTwoPagePanelConfig: PanelConfig;
  portfolioAssistantPagePanelConfig: PanelConfig;
  companyPanelConfig: {
    default: PanelConfig;
    portfolioManager: PanelConfig;
  };
  securityManagerPagePanelConfig: PanelConfig;
}
