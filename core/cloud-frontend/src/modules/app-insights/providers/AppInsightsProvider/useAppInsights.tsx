import { useContext } from "react";
import { AppInsightsContext } from "./AppInsightsContext";

export const useAppInsights = () => {
  const context = useContext(AppInsightsContext);

  if (!context) {
    throw new Error("useAppInsights must be used within a AppInsightsProvider");
  }

  return context;
};
