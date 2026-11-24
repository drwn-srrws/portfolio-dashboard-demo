import { createContext, RefObject, useContext } from "react";
import { IChartRef } from "../typings/IChartRef";

export const ChartRefContext = createContext<RefObject<IChartRef> | null>(null);

export const useChartRefContext = () => {
  const context = useContext(ChartRefContext);

  if (!context) {
    throw new Error("ChartRefContext not found");
  }

  return context;
};
