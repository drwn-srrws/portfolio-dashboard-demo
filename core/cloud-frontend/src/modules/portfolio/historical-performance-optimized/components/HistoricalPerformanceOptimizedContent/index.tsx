import Dockview from "@/components/Dockview/Dockview";
import { MainWrapper } from "@components/MainWrapper";
import { useFeatureFlags } from "@hooks/useFeatureFlags";
import { useConfig } from "@/providers/ConfigProvider/useConfig";
import { AppToolbar } from "@/components/Toolbar/components/AppToolbar";
import { GlobalYearSelector } from "@/components/Toolbar/components/GlobalYearSelector";
import { ExplodeBaskets } from "@/modules/dashboard/components/ExplodeBaskets";
import { components } from "../../utils/dockview";

export const HistoricalPerformanceOptimizedContent = () => {
  const { pages, portfolioHistoricalPerformanceOptimizedPagePanelConfig } =
    useConfig();
  const showDatePicker =
    pages?.portfolioHistoricalPerformance?.showDatePicker ?? true;

  const { isFeatureEnabled } = useFeatureFlags();

  return (
    <div className="flex size-full flex-col">
      <AppToolbar
        disableDateRange={!showDatePicker}
        secondaryActionSlot={
          <>
            <GlobalYearSelector />
            {isFeatureEnabled("enableBasketExplosion") && <ExplodeBaskets />}
          </>
        }
      />

      <MainWrapper>
        <Dockview
          components={components}
          json={portfolioHistoricalPerformanceOptimizedPagePanelConfig}
          theme="dockview-theme-dark"
        />
      </MainWrapper>
    </div>
  );
};
