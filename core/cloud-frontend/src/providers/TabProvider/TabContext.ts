import { createContext, useContext } from "react";

export interface ITabContext<T extends string = string> {
  tab: T;
  setTab: (tab: T) => void;
}

export const TabContext = createContext<ITabContext | null>(null);

export const useTab = <T extends string = string>() => {
  const context = useContext(TabContext) as ITabContext<T> | null;

  if (!context) {
    throw new Error("useTab must be used within TabContext");
  }

  return context;
};
