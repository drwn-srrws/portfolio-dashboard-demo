import { createContext } from "react";

export type IMode = "edit" | "view" | "create";

export interface IModeContext {
  mode: IMode;
  setMode: (mode: IMode) => void;
}

export const ModeContext = createContext<IModeContext>({
  mode: "view",
  setMode: () => {},
});
