import Dockview from "@/components/Dockview/Dockview";
import { MainWrapper } from "@components/MainWrapper";
import { useFeatureFlags } from "@hooks/useFeatureFlags";
import { useConfig } from "@/providers/ConfigProvider/useConfig";
import { components } from "../../utils/dockview";
import { ExplodeBaskets } from "@/modules/dashboard/components/ExplodeBaskets";
import { AppToolbar } from "@/components/Toolbar/components/AppToolbar";

export const PositionDifferencesOptimizedContent = () => {
  const { portfolioPositionDifferencesOptimizedPagePanelConfig } = useConfig();
  const { isFeatureEnabled } = useFeatureFlags();

  return (
    <div className="flex size-full flex-col">
      <AppToolbar
        secondaryActionSlot={
          isFeatureEnabled("enableBasketExplosion") && <ExplodeBaskets />
        }
      />

      <MainWrapper>
        <Dockview
          components={components}
          json={portfolioPositionDifferencesOptimizedPagePanelConfig}
          theme="dockview-theme-dark"
        />
      </MainWrapper>
    </div>
  );
};
