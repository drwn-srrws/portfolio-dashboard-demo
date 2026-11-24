import { ReactNode, useCallback, useMemo } from "react";
import { IMode, ModeContext } from "./ModeContext";

export interface IModeProviderProps {
  mode: IMode;
  children: ReactNode;
  onModeChange?: (mode: IMode) => void;
}

export const ModeProvider = ({
  mode,
  onModeChange,
  children,
}: IModeProviderProps) => {
  const setMode = useCallback(
    (mode: IMode) => {
      onModeChange?.(mode);
    },
    [onModeChange]
  );

  const contextValue = useMemo(() => ({ mode, setMode }), [mode, setMode]);

  return (
    <ModeContext.Provider value={contextValue}>{children}</ModeContext.Provider>
  );
};
