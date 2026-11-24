import { MainWrapper } from "@components/MainWrapper";
import { SecurityDialog } from "../../dialogs/SecurityDialog";
import Dockview from "@/components/Dockview/Dockview";
import { components } from "./dockview";
import { useConfig } from "@/providers/ConfigProvider/useConfig";
import { StepProvider } from "@/providers/StepProvider";
import { AppToolbar } from "@/components/Toolbar/components/AppToolbar";
import { SecurityManagerTabProvider } from "../../components/SecurityManagerTabProvider";
import { SecurityManagerTab } from "../../types/SecurityManagerTab";
import { SecurityManagerTabSelect } from "../../components/SecurityManagerTabSelect";

export const Securities = () => {
  const { securityManagerPagePanelConfig } = useConfig();

  return (
    <SecurityManagerTabProvider tab={SecurityManagerTab.Securities}>
      <AppToolbar disableDateRange filtersSlot={<SecurityManagerTabSelect />} />
      <MainWrapper>
        <Dockview
          theme="dockview-theme-dark"
          components={components}
          json={securityManagerPagePanelConfig}
        />
        <StepProvider>
          <SecurityDialog />
        </StepProvider>
      </MainWrapper>
    </SecurityManagerTabProvider>
  );
};
