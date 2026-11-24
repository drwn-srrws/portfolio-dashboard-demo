import { useMemo } from "react";

import { useCompanyPageData } from "@/hooks/api/useCompanyPageData";
import { EventDetailsProvider } from "@/providers/EventDetailsProvider";
import { CompanyPriceTargets } from "@components/CompanyPriceTargets/CompanyPriceTargets";
import Dockview from "@/components/Dockview/Dockview";
import { useConfig } from "@/providers/ConfigProvider/useConfig";
import { useParams } from "react-router-dom";

import { RoleKinds } from "@typings/Role";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { useFeatureFlags } from "@hooks/useFeatureFlags";
import { hasRole } from "@/utils/roleUtils";
import { CoveragesContextProvider } from "@providers/CoveragesProvider";
import { CompanyPriceTargetsProvider } from "@/providers/CompanyPriceTargetsProvider";
import { components } from "./utils/dockview-components";
import { withoutDrugProgramsPanel } from "./utils/companyPanelConfig";
import { MainWrapper } from "@/components/MainWrapper";
import { AppToolbar } from "@/components/Toolbar/components/AppToolbar";
import { useIsMobile } from "@/hooks/useMobile";

export const CompanyPage = () => {
  const params = useParams();
  const isMobile = useIsMobile();
  const { companyId } = params;
  const { account } = useAuth();
  const { companyPanelConfig } = useConfig();
  const { isFeatureEnabled } = useFeatureFlags();

  const kgEnabled = isFeatureEnabled("enableKgFeatures");

  const { companyData } = useCompanyPageData(Number(companyId), {
    includeDrugs: kgEnabled,
  });

  const isPortfolioManager = hasRole(account?.roles, [
    RoleKinds.PortfolioManager,
  ]);

  const baseJson = isPortfolioManager
    ? companyPanelConfig.portfolioManager
    : companyPanelConfig.default;

  const json = useMemo(
    () => (kgEnabled ? baseJson : withoutDrugProgramsPanel(baseJson)),
    [baseJson, kgEnabled]
  );

  return (
    <CompanyPriceTargetsProvider>
      <EventDetailsProvider>
        <CoveragesContextProvider>
          {isMobile && <AppToolbar disableDateRange disableFilters />}
          <MainWrapper variant={isMobile ? "default" : "rounded"}>
            <div className="flex h-full flex-col gap-3">
              <h1 className="mt-2 text-4xl font-semibold capitalize">
                {companyData?.name}
              </h1>
              <div className="flex size-full h-full flex-col overflow-hidden pt-2">
                <Dockview
                  components={components}
                  json={json}
                  theme="dockview-theme-dark"
                />
              </div>
            </div>
            <CompanyPriceTargets />
          </MainWrapper>
        </CoveragesContextProvider>
      </EventDetailsProvider>
    </CompanyPriceTargetsProvider>
  );
};
