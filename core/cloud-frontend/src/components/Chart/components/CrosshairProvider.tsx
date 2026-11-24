import { ReactNode } from "react";
import { CrosshairContext } from "../context/CrosshairContext";
import { useChartRefContext } from "../context/ChartRefContext";
import { useCrosshairPriorityContext } from "../context/CrosshairPriorityContext";
import { useCrosshair } from "../hooks/useCrosshair";

export interface CrosshairProviderProps {
  children: ReactNode;
}

export const CrosshairProvider = ({ children }: CrosshairProviderProps) => {
  const chartRef = useChartRefContext();
  const priority = useCrosshairPriorityContext();
  const result = useCrosshair({
    chartRef,
    prioritySeriesRefs: priority?.prioritySeriesRefs,
  });

  return (
    <CrosshairContext.Provider value={result}>
      {children}
    </CrosshairContext.Provider>
  );
};
