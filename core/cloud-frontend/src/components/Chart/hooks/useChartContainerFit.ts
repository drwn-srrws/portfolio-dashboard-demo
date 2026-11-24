import { RefObject, useLayoutEffect } from "react";
import useEffectEvent from "@hooks/useEffectEvent";
import { IChartRef } from "../typings/IChartRef";

export interface UseChartContainerFitOptions {
  chartRef: RefObject<IChartRef>;
  container: HTMLDivElement;
  enabled?: boolean;
}

export const useChartContainerFit = ({
  chartRef,
  container,
  enabled,
}: UseChartContainerFitOptions) => {
  const handleResize = useEffectEvent(() => {
    if (!enabled) return;
    const currentChartRef = chartRef.current;
    currentChartRef.api?.timeScale().fitContent();
  });

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [container, handleResize]);
};
