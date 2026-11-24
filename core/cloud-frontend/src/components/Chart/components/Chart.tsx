import { memo, ReactNode, Ref, useCallback, useState } from "react";
import { ChartOptions, DeepPartial } from "lightweight-charts";
import { IChartRef } from "../typings/IChartRef";
import { ChartViewport } from "./ChartViewport";

export type ChartProps = DeepPartial<ChartOptions> & {
  resizable?: boolean;
  chartRef?: Ref<IChartRef>;
  children?: ReactNode;
};

export const Chart = memo(({ children, ...props }: ChartProps) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const handleContainerRef = useCallback((ref: HTMLDivElement) => {
    setContainer(ref);
  }, []);

  return (
    <div className="size-full relative">
      <div ref={handleContainerRef} className="absolute size-full" />
      {container && (
        <ChartViewport {...props} container={container}>
          {children}
        </ChartViewport>
      )}
    </div>
  );
});
