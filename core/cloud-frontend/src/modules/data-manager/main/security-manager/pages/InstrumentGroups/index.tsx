import { MainWrapper } from "@components/MainWrapper";
import { AppToolbar } from "@/components/Toolbar/components/AppToolbar";
import { InstrumentGroupDialog } from "../../dialogs/InstrumentGroupDialog";
import { SecurityManagerTab } from "../../types/SecurityManagerTab";
import { SecurityManagerTabProvider } from "../../components/SecurityManagerTabProvider";
import { SecurityManagerTabSelect } from "../../components/SecurityManagerTabSelect";
import { CreateInstrumentGroupButton } from "../../components/CreateInstrumentGroupButton";
import Dockview from "@/components/Dockview/Dockview";
import { components, config } from "./dockview";

export const InstrumentGroups = () => (
  <SecurityManagerTabProvider tab={SecurityManagerTab.InstrumentGroups}>
    <AppToolbar
      disableDateRange
      filtersSlot={<SecurityManagerTabSelect />}
      primaryActionSlot={<CreateInstrumentGroupButton />}
    />
    <MainWrapper>
      <Dockview
        theme="dockview-theme-dark"
        components={components}
        json={config}
      />
      <InstrumentGroupDialog />
    </MainWrapper>
  </SecurityManagerTabProvider>
);
