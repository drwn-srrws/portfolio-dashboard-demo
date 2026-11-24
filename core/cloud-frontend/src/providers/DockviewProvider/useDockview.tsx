import { useContext } from "react";
import { DockviewProviderContext } from "./DockviewContext";

export const useDockview = () => {
  const context = useContext(DockviewProviderContext);

  if (context === undefined) {
    throw new Error("useDockview must be used within a DockviewProvider");
  }

  return context;
};
