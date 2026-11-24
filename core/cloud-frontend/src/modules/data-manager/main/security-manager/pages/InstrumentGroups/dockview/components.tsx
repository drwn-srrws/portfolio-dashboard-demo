import { IDockviewPanelProps } from "dockview-react";
import React from "react";
import { PanelProvider } from "@/providers/PanelProvider";
import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
import { InstrumentGroups as InstrumentGroupsPanel } from "../components/InstrumentGroups";

export const InstrumentGroups = React.memo((props: IDockviewPanelProps) => {
  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <InstrumentGroupsPanel />
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});
