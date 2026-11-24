import { ReactNode } from "react";
import { IDockviewPanelProps } from "dockview-react";
import { PanelContext } from "./PanelContext";

export interface PanelProviderProps {
  value: IDockviewPanelProps;
  children: ReactNode;
}

export const PanelProvider = ({ value, children }: PanelProviderProps) => (
  <PanelContext.Provider value={value}>{children}</PanelContext.Provider>
);
