import { useEffect, useRef } from "react";
import { ChartOptions, createChart, DeepPartial } from "lightweight-charts";
import { IChartRef } from "../typings/IChartRef";
import { defaultChartOptions } from "../constants/defaultChartOptions";

export interface UseChartApiOptions {
  options: DeepPartial<ChartOptions>;
  container: HTMLDivElement;
}

export const useChartApi = ({ container, options }: UseChartApiOptions) => {
  const chartRef = useRef<IChartRef>({
    api: null,
    create() {
      if (this.api) return;

      const api = createChart(container, {
        ...defaultChartOptions,
        ...options,
      });

      this.api = api;

      api.priceScale("right").applyOptions({ visible: false });
      api.timeScale().fitContent();
    },
    dispose() {
      this.api?.remove();
      this.api = null;
    },
  });

  useEffect(() => {
    const currentChartRef = chartRef.current;
    currentChartRef.create();
    return () => currentChartRef.dispose();
  }, []);

  useEffect(() => {
    chartRef.current.api?.applyOptions(options);
  }, [options]);

  return { chartRef };
};
