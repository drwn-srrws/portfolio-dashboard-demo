import { ReactNode, useMemo } from "react";
import { ITabContext, TabContext } from "./TabContext";

export interface TabProviderProps<T extends string = string> {
  tab: T;
  onTabChange: (tab: T) => void;
  children?: ReactNode;
}

export const TabProvider = <T extends string = string>({
  tab,
  onTabChange,
  children,
}: TabProviderProps<T>) => {
  const context = useMemo(
    () => ({ tab, setTab: onTabChange }) as unknown as ITabContext,
    [onTabChange, tab]
  );

  return <TabContext.Provider value={context}>{children}</TabContext.Provider>;
};
