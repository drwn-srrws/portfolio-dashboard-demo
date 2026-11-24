import { ReactNode, useMemo } from "react";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { ModeContext } from "./ModeContext";

export interface QueryModeProviderProps {
  children?: ReactNode;
}

export const QueryModeProvider = ({ children }: QueryModeProviderProps) => {
  const [mode, setMode] = useQueryState(
    "mode",
    parseAsStringLiteral(Object.values(["view", "edit", "create"])).withDefault(
      "view"
    )
  );

  const context = useMemo(() => ({ mode, setMode }), [mode, setMode]);

  return (
    <ModeContext.Provider value={context}>{children}</ModeContext.Provider>
  );
};
