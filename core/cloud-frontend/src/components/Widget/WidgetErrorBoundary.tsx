import { ReactNode, useCallback } from "react";

import { ErrorOverlay } from "@components/Overlay/ErrorOverlay";
import { Button } from "@components/ui";
import { useDockview } from "@/providers/DockviewProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { usePanel } from "@/providers/PanelProvider";
import { useMode } from "@/providers/ModeProvider";

export interface WidgetErrorBoundaryProps {
  children: ReactNode;
}

export const WidgetErrorBoundary = ({ children }: WidgetErrorBoundaryProps) => {
  const { api } = usePanel();
  const { mode } = useMode();
  const { removeComponent } = useDockview();

  const componentId = api.id;

  const handleRemoveWidget = useCallback(() => {
    removeComponent(componentId);
  }, [removeComponent, componentId]);

  return (
    <ErrorBoundary
      fallback={() => (
        <ErrorOverlay>
          {(mode === "edit" || mode === "create") && (
            <Button variant="secondary" onClick={handleRemoveWidget}>
              Remove card
            </Button>
          )}
        </ErrorOverlay>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};
