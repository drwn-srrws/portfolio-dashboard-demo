import Dockview from "@/components/Dockview/Dockview";
import { MainWrapper } from "@components/MainWrapper";
import { useFeatureFlags } from "@hooks/useFeatureFlags";
import { useConfig } from "@/providers/ConfigProvider/useConfig";
import { ExplodeBaskets } from "@/modules/dashboard/components/ExplodeBaskets";
import { AppToolbar } from "@/components/Toolbar/components/AppToolbar";

import { components } from "../../utils/dockview";

export const PerformanceSummaryIIContent = () => {
  const { portfolioPerformanceSummaryIIPagePanelConfig } = useConfig();
  const { isFeatureEnabled } = useFeatureFlags();

  return (
    <div className="flex size-full flex-col">
      <AppToolbar
        disableDateRange
        secondaryActionSlot={
          isFeatureEnabled("enableBasketExplosion") && <ExplodeBaskets />
        }
      />

      <MainWrapper>
        <Dockview
          components={components}
          json={portfolioPerformanceSummaryIIPagePanelConfig}
          theme="dockview-theme-dark"
        />
      </MainWrapper>
    </div>
  );
};
