import { RefObject, useEffect } from "react";
import { IChartRef } from "../typings/IChartRef";

export interface UseChartTimeScaleFitOptions {
  chartRef: RefObject<IChartRef>;
  enabled?: boolean;
}

export const useChartTimeScaleFit = ({
  chartRef,
  enabled,
}: UseChartTimeScaleFitOptions) => {
  useEffect(() => {
    const currentChartRef = chartRef.current;

    if (enabled) {
      currentChartRef.api?.timeScale().fitContent();
    }

    return () => {
      if (enabled) {
        currentChartRef.api?.timeScale().fitContent();
      }
    };
  }, [chartRef, enabled]);
};
