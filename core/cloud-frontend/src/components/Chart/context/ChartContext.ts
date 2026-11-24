import { createContext, useContext } from "react";

export interface IChartContext {
  resizable?: boolean;
}

export const ChartContext = createContext<IChartContext | null>(null);

export const useChartContext = () => {
  const context = useContext(ChartContext);

  if (!context) {
    throw new Error("ChartContext not found");
  }

  return context;
};
