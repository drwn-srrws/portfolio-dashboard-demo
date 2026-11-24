import { MainWrapper } from "@components/MainWrapper";
import { CompanyDialog } from "../../dialogs/CompanyDialog";
import { SecurityManagerTabSelect } from "../../components/SecurityManagerTabSelect";
import { AppToolbar } from "@/components/Toolbar/components/AppToolbar";
import { SecurityManagerTabProvider } from "../../components/SecurityManagerTabProvider";
import { SecurityManagerTab } from "../../types/SecurityManagerTab";
import Dockview from "@/components/Dockview/Dockview";
import { components, config } from "./dockview";

export const Companies = () => (
  <SecurityManagerTabProvider tab={SecurityManagerTab.Companies}>
    <AppToolbar disableDateRange filtersSlot={<SecurityManagerTabSelect />} />
    <MainWrapper>
      <Dockview
        theme="dockview-theme-dark"
        components={components}
        json={config}
      />
      <CompanyDialog />
    </MainWrapper>
  </SecurityManagerTabProvider>
);
