import { ReactNode, useCallback, useEffect, useMemo, useReducer } from "react";
import { DockviewApi, SerializedDockview } from "dockview-react";
import { toast } from "@components/ui/use-toast";
import {
  Action,
  DockviewPanelParams,
  DockviewProviderContext,
  DockviewProviderState,
  initialState,
} from "./DockviewContext";

const reducer = (
  state: DockviewProviderState,
  action: Action
): DockviewProviderState => {
  switch (action.type) {
    case "CHANGE_TITLE":
      return { ...state };
    case "SET_API":
      return { ...state, api: action.payload };
    case "SET_LAYOUT":
      return { ...state, layout: action.payload };
    default:
      return state;
  }
};

const copyToClipboard = async (text: string) => {
  return await navigator.clipboard.writeText(text);
};

export interface DockviewProviderProps {
  children: ReactNode;
}

export function DockviewProvider({ children }: DockviewProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addComponent = useCallback(
    (componentName: string, params?: DockviewPanelParams) => {
      if (state.api) {
        state.api.addPanel({
          id: `${componentName}_${Date.now()}`,
          title: params?.titleSettings || `Untitled - ${componentName}`,
          minimumHeight: 30,
          component: componentName,
          position: { direction: "right" },
          params: params,
        });
      }
    },
    [state.api]
  );

  const updateComponent = useCallback(
    (componentId: string, params?: DockviewPanelParams) => {
      if (state.api) {
        const panel = state.api.panels.find((p) => p.id === componentId);

        if (panel) {
          panel.setTitle(params?.titleSettings);

          panel.api.updateParameters({
            ...params,
          });
        }
      }
    },
    [state.api]
  );

  const duplicateComponent = useCallback(
    (componentId: string) => {
      if (state.api) {
        const sourcePanel = state.api.panels.find((p) => p.id === componentId);

        if (sourcePanel) {
          state.api.addPanel({
            id: `${sourcePanel.api.component}_${Date.now()}`,
            title: `${sourcePanel?.title?.replace(
              /([a-z])([A-Z])/g,
              "$1 $2"
            )} (Copy)`,
            component: sourcePanel?.api.component,
            params: sourcePanel?.params,
            position: { direction: "right", referencePanel: componentId },
          });
        }
      }
    },
    [state.api]
  );

  const copyComponent = useCallback(
    async (componentId: string) => {
      if (state.api) {
        const sourcePanel = state.api.panels.find((p) => p.id === componentId);

        const newPanel = {
          id: `${sourcePanel?.api.component}_${Date.now()}`,
          title: `${sourcePanel?.title?.replace(
            /([a-z])([A-Z])/g,
            "$1 $2"
          )} (Copy)`,
          component: sourcePanel?.api.component,
          params: sourcePanel?.params,
        };

        if (sourcePanel) {
          try {
            await copyToClipboard(JSON.stringify(newPanel));
            toast({
              title: "Card copied to clipboard",
            });
          } catch (error) {
            console.error("Error copying to clipboard", error);
          }
        }
      }
    },
    [state.api]
  );

  const pasteComponent = useCallback(async () => {
    if (state.api) {
      try {
        const pastedPanel = JSON.parse(await navigator.clipboard.readText());
        const newPanel = {
          ...pastedPanel,
          id: `${pastedPanel.component}_${Date.now()}`,
          position: { direction: "right" },
        };
        state.api.addPanel(newPanel);

        toast({
          title: "Card was added to the dashboard",
        });
      } catch (error) {
        console.error("Error pasting component", error);
      }
    }
  }, [state.api]);

  const removeComponent = useCallback(
    (componentId: string) => {
      if (state.api) {
        const panel = state.api.panels.find((p) => p.id === componentId);
        if (panel) {
          state.api.removePanel(panel);
        }
      }
    },
    [state.api]
  );

  const changeComponentTitle = useCallback(
    (componentId: string, newTitle: string) => {
      if (state.api) {
        const panel = state.api.panels.find((p) => p.id === componentId);
        if (panel) {
          panel.setTitle(newTitle);
          dispatch({ type: "CHANGE_TITLE" });
        }
      }
    },
    [state.api]
  );

  const setApi = useCallback(
    (api: DockviewApi | null) => {
      dispatch({ type: "SET_API", payload: api });
    },
    [dispatch]
  );

  const updateLayout = useCallback(() => {
    const layout: SerializedDockview | null = state?.api?.toJSON() || null;
    dispatch({ type: "SET_LAYOUT", payload: layout });
  }, [state.api]);

  useEffect(() => {
    if (!state.api) {
      return;
    }

    updateLayout();

    const disposable = state.api.onDidLayoutChange(() => {
      updateLayout();
    });

    return () => disposable.dispose();
  }, [state.api, updateLayout]);

  const value = useMemo(
    () => ({
      api: state.api,
      layout: state.layout,
      addComponent,
      duplicateComponent,
      updateComponent,
      copyComponent,
      pasteComponent,
      removeComponent,
      changeComponentTitle,
      setApi,
    }),
    [
      state.api,
      state.layout,
      addComponent,
      duplicateComponent,
      updateComponent,
      copyComponent,
      pasteComponent,
      removeComponent,
      changeComponentTitle,
      setApi,
    ]
  );

  return (
    <DockviewProviderContext.Provider value={value}>
      {children}
    </DockviewProviderContext.Provider>
  );
}
