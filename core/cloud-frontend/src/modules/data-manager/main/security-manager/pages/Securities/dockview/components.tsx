import { IDockviewPanelProps } from "dockview-react";
import React from "react";
import { PanelProvider } from "@/providers/PanelProvider";
import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
import { PendingSecurities as PendingSecuritiesPanel } from "../components/PendingSecurities";
import { ExternallyPublishedSecurities as ExternallyPublishedSecuritiesPanel } from "../components/ExternallyPublishedSecurities";

export const PendingSecurities = React.memo((props: IDockviewPanelProps) => {
  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <PendingSecuritiesPanel />
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const ExternallyPublishedSecurities = React.memo(
  (props: IDockviewPanelProps) => {
    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <ExternallyPublishedSecuritiesPanel />
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);
