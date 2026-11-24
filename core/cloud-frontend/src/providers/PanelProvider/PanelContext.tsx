import { IDockviewPanelProps } from "dockview-react";
import { createContext } from "react";

export const PanelContext = createContext<IDockviewPanelProps>(
  {} as IDockviewPanelProps
);
