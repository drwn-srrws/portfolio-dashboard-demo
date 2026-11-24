import { memo, ReactNode, Ref, useImperativeHandle, useMemo } from "react";
import { ChartOptions, DeepPartial } from "lightweight-charts";
import { ChartRefContext } from "../context/ChartRefContext";
import { CrosshairPriorityProvider } from "./CrosshairPriorityProvider";
import { CrosshairProvider } from "./CrosshairProvider";
import { useChartApi } from "../hooks/useChartApi";
import { IChartRef } from "../typings/IChartRef";
import { ChartContext } from "../context/ChartContext";
import { useChartContainerFit } from "../hooks/useChartContainerFit";

export interface ChartViewportProps extends DeepPartial<ChartOptions> {
  resizable?: boolean;
  chartRef?: Ref<IChartRef>;
  container: HTMLDivElement;
  children?: ReactNode;
}

export const ChartViewport = memo(
  ({
    resizable,
    children,
    container,
    chartRef: propChartRef,
    ...options
  }: ChartViewportProps) => {
    const { chartRef } = useChartApi({ container, options });

    const context = useMemo(() => ({ resizable }), [resizable]);

    useChartContainerFit({ chartRef, container, enabled: resizable });
    useImperativeHandle(propChartRef, () => chartRef.current);

    return (
      <ChartContext.Provider value={context}>
        <ChartRefContext.Provider value={chartRef}>
          <CrosshairPriorityProvider>
            <CrosshairProvider>{children}</CrosshairProvider>
          </CrosshairPriorityProvider>
        </ChartRefContext.Provider>
      </ChartContext.Provider>
    );
  }
);
