import Dockview from "@/components/Dockview/Dockview";
import { MainWrapper } from "@components/MainWrapper";
import { useFeatureFlags } from "@hooks/useFeatureFlags";
import { useConfig } from "@/providers/ConfigProvider/useConfig";
import { components } from "../../utils/dockview";
import { ExplodeBaskets } from "@/modules/dashboard/components/ExplodeBaskets";
import { AppToolbar } from "@/components/Toolbar/components/AppToolbar";

export const PositionExposureContent = () => {
  const { portfolioPositionExposurePagePanelConfig } = useConfig();
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
          json={portfolioPositionExposurePagePanelConfig}
          theme="dockview-theme-dark"
        />
      </MainWrapper>
    </div>
  );
};
