import Dockview from "@/components/Dockview/Dockview";
import { MainWrapper } from "@components/MainWrapper";
import { useConfig } from "@/providers/ConfigProvider/useConfig";
import { AppToolbar } from "@/components/Toolbar/components/AppToolbar";
import { components } from "../../utils/dockview";
import { useFeatureFlags } from "@hooks/useFeatureFlags";
import { ExplodeBaskets } from "@/modules/dashboard/components/ExplodeBaskets";

export const LtdAlphaTwoContent = () => {
  const { portfolioLtdAlphaTwoPagePanelConfig } = useConfig();
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
          json={portfolioLtdAlphaTwoPagePanelConfig}
          theme="dockview-theme-dark"
        />
      </MainWrapper>
    </div>
  );
};
