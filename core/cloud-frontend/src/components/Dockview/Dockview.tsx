import "./dockview.css";

import {
  DockviewDefaultTab,
  DockviewReact,
  DockviewReadyEvent,
  IDockviewPanelHeaderProps,
  IDockviewPanelProps,
  SerializedDockview,
} from "dockview-react";
import * as React from "react";
import { FunctionComponent, useCallback } from "react";

import { useDockview } from "@/providers/DockviewProvider";
import { useMode } from "@/providers/ModeProvider";
import { cn } from "@/utils";

const DebugContext = React.createContext<boolean>(false);

const headerComponents = {
  default: (props: IDockviewPanelHeaderProps) => {
    return <DockviewDefaultTab hideClose {...props} />;
  },
};

const Dockview = ({
  theme = "dockview-theme-abyss",
  components,
  json,
}: {
  theme?: string;
  components: Record<string, FunctionComponent<IDockviewPanelProps>>;
  json?: SerializedDockview;
}) => {
  const { setApi } = useDockview();
  const { mode } = useMode();

  const onReady = useCallback(
    (event: DockviewReadyEvent) => {
      const { api } = event;

      api.onWillDrop((e) => {
        if (!e.position || e.position === "center") {
          e.preventDefault();
        }
      });

      api.onWillDragGroup((e) => {
        e.nativeEvent.preventDefault();
      });

      setApi(api);

      try {
        if (json?.panels) {
          event.api.fromJSON(json);
        }
      } catch (error) {
        console.error("Error setting up dockview layout", error);
      }
    },
    [json, setApi]
  );

  return (
    <div
      className={cn(
        "relative flex flex-col size-full rounded-lg",
        `dockview-mode-${mode}`
      )}
    >
      <div className="relative flex flex-col md:absolute md:inset-0">
        <DebugContext.Provider value={false}>
          <DockviewReact
            components={components}
            defaultTabComponent={headerComponents.default}
            onReady={onReady}
            className={theme}
            singleTabMode="fullwidth"
            hideBorders
            gap={8}
          />
        </DebugContext.Provider>
      </div>
    </div>
  );
};

export default Dockview;
