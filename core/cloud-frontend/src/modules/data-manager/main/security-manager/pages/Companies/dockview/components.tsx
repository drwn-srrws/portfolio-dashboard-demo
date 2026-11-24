import { IDockviewPanelProps } from "dockview-react";
import React from "react";
import { PanelProvider } from "@/providers/PanelProvider";
import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
import { Companies as CompaniesPanel } from "../components/Companies";

export const Companies = React.memo((props: IDockviewPanelProps) => {
  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <CompaniesPanel />
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});
