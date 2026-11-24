/* eslint-disable @typescript-eslint/no-explicit-any */

import { DockviewApi, SerializedDockview } from "dockview-react";
import { createContext } from "react";

export type DockviewPanelParams = {
  [key: string]: any;
};

export type DockviewProviderState = {
  api: DockviewApi | null;
  layout: SerializedDockview | null;
  addComponent: (componentName: string, params?: DockviewPanelParams) => void;
  duplicateComponent: (componentId: string) => void;
  removeComponent: (componentId: string) => void;
  changeComponentTitle: (componentId: string, newTitle: string) => void;
  updateComponent: (componentId: string, params?: DockviewPanelParams) => void;
  setApi: (api: DockviewApi | null) => void;
  copyComponent: (componentId: string) => void;
  pasteComponent: () => void;
};

export type Action =
  | { type: "TOGGLE_EDIT_MODE" }
  | { type: "CHANGE_TITLE" }
  | { type: "SET_API"; payload: DockviewApi | null }
  | { type: "SET_LAYOUT"; payload: SerializedDockview | null };

export const initialState: DockviewProviderState = {
  api: null,
  layout: null,
  addComponent: () => null,
  duplicateComponent: () => null,
  copyComponent: () => null,
  removeComponent: () => null,
  changeComponentTitle: () => null,
  updateComponent: () => null,
  pasteComponent: () => null,
  setApi: () => null,
};

export const DockviewProviderContext =
  createContext<DockviewProviderState>(initialState);
