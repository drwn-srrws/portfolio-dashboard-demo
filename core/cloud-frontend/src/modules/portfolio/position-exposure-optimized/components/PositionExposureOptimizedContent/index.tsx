import Dockview from "@/components/Dockview/Dockview";
import { MainWrapper } from "@components/MainWrapper";
import { useConfig } from "@/providers/ConfigProvider/useConfig";
import { components } from "../../utils/dockview";
import { AppToolbar } from "@/components/Toolbar/components/AppToolbar";
import { ExplodeBaskets } from "@/modules/dashboard/components/ExplodeBaskets";
import { useFeatureFlags } from "@hooks/useFeatureFlags";

export const PositionExposureOptimizedContent = () => {
  const { portfolioPositionExposureOptimizedPagePanelConfig } = useConfig();
  const { isFeatureEnabled } = useFeatureFlags();

  return (
    <div className="relative flex size-full flex-col">
      <AppToolbar
        secondaryActionSlot={
          isFeatureEnabled("enableBasketExplosion") && <ExplodeBaskets />
        }
      />

      <MainWrapper>
        <Dockview
          components={components}
          json={portfolioPositionExposureOptimizedPagePanelConfig}
          theme="dockview-theme-dark"
        />
      </MainWrapper>
    </div>
  );
};
