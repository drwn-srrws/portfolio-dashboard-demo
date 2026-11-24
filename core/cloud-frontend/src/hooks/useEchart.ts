import { RefObject, useEffect, useState } from "react";
import * as echarts from "echarts";
import { debounce } from "@/utils";

export interface UseEchartOptions {
  containerRef: RefObject<HTMLDivElement | null>;
}

export const useEchart = ({ containerRef }: UseEchartOptions) => {
  const [chart, setChart] = useState<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = echarts.init(containerRef.current);

    setChart(chart);

    return () => chart.dispose();
  }, [containerRef]);

  useEffect(() => {
    if (!chart || !containerRef.current) return;

    const resizeObserver = new ResizeObserver(
      debounce(() => chart.resize(), 100)
    );

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [chart, containerRef]);

  return { chart };
};
