import Dockview from "@/components/Dockview/Dockview";
import { MainWrapper } from "@components/MainWrapper";
import { useConfig } from "@/providers/ConfigProvider/useConfig";
import { components } from "../../utils/dockview";
import { ExplodeBaskets } from "@/modules/dashboard/components/ExplodeBaskets";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { AppToolbar } from "@/components/Toolbar/components/AppToolbar";

export const PositionDifferencesContent = () => {
  const { isFeatureEnabled } = useFeatureFlags();
  const { portfolioPositionDifferencesPagePanelConfig } = useConfig();

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
          json={portfolioPositionDifferencesPagePanelConfig}
          theme="dockview-theme-dark"
        />
      </MainWrapper>
    </div>
  );
};
