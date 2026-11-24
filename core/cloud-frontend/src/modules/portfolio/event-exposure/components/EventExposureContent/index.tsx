import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { useConfig } from "@/providers/ConfigProvider/useConfig";
import Dockview from "@components/Dockview/Dockview";
import { MainWrapper } from "@components/MainWrapper";
import { components } from "../../utils/dockview";
import { ExplodeBaskets } from "@/modules/dashboard/components/ExplodeBaskets";
import { AppToolbar } from "@/components/Toolbar/components/AppToolbar";
import { GlobalEventFilters } from "../GlobalEventFilters";
import { ImpactThreshold } from "../ImpactThreshold";
import { useIsMobile } from "@/hooks/useMobile";

export const EventExposureContent = () => {
  const { portfolioEventExposurePagePanelConfig } = useConfig();

  const { isFeatureEnabled } = useFeatureFlags();

  const secondaryActions = (
    <div className="flex gap-4 flex-col sm:flex-row items-end justify-center sm:items-center sm:justify-end">
      {isFeatureEnabled("enableBasketExplosion") && <ExplodeBaskets />}
      <ImpactThreshold />
    </div>
  );

  const isMobile = useIsMobile();

  return (
    <div className="flex size-full flex-col">
      <AppToolbar
        filtersSlot={<GlobalEventFilters />}
        secondaryActionSlot={isMobile ? null : secondaryActions}
        bottomSlot={isMobile ? secondaryActions : null}
      />

      <MainWrapper>
        <Dockview
          components={components}
          json={portfolioEventExposurePagePanelConfig}
          theme="dockview-theme-dark"
        />
      </MainWrapper>
    </div>
  );
};
