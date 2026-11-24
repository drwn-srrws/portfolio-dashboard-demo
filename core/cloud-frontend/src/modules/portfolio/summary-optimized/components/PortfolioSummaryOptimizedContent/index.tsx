import Dockview from "@/components/Dockview/Dockview";
import { MainWrapper } from "@components/MainWrapper";
import { useConfig } from "@/providers/ConfigProvider/useConfig";
import { components } from "../../utils/dockview";
import { AppToolbar } from "@/components/Toolbar/components/AppToolbar";
import { useFeatureFlags } from "@hooks/useFeatureFlags";
import { ExplodeBaskets } from "@/modules/dashboard/components/ExplodeBaskets";

export const PortfolioSummaryOptimizedContent = () => {
  const { portfolioSummaryOptimizedPagePanelConfig } = useConfig();
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
          json={portfolioSummaryOptimizedPagePanelConfig}
          theme="dockview-theme-dark"
        />
      </MainWrapper>
    </div>
  );
};
