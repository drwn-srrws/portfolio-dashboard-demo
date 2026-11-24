import { RefObject, useEffect, useRef } from "react";
import { DeepPartial, PriceScaleOptions } from "lightweight-charts";
import { IChartRef } from "../typings/IChartRef";
import { IPriceScaleRef } from "../typings/IPriceScaleRef";

export interface UsePriceScaleApiOptions {
  id: string;
  options: DeepPartial<PriceScaleOptions>;
  chartRef: RefObject<IChartRef>;
}

export const usePriceScaleApi = ({
  id,
  options,
  chartRef,
}: UsePriceScaleApiOptions) => {
  const priceScaleRef = useRef<IPriceScaleRef>({
    api: null,
    create(id: string) {
      if (this.api) return;
      this.api = chartRef.current.api?.priceScale(id) ?? null;
      this.api?.applyOptions({ visible: true });
    },
    dispose() {
      try {
        this.api?.applyOptions({ visible: false });
        this.api = null;
      } catch {
        this.api = null;
      }
    },
  });

  useEffect(() => {
    const currentPriceScaleRef = priceScaleRef.current;
    const currentChartRef = chartRef.current;

    currentChartRef.create();
    currentPriceScaleRef.create(id);

    return () => {
      currentPriceScaleRef.dispose();
    };
  }, [chartRef, id]);

  useEffect(() => {
    priceScaleRef.current.api?.applyOptions(options);
  }, [chartRef, options]);

  return { priceScaleRef };
};
