import { memo, ReactNode, RefObject, useImperativeHandle } from "react";
import { DeepPartial, PriceScaleOptions } from "lightweight-charts";
import { useChartRefContext } from "../context/ChartRefContext";
import { usePriceScaleApi } from "../hooks/usePriceScaleApi";
import { IPriceScaleRef } from "../typings/IPriceScaleRef";
import { PriceScaleIdContext } from "../context/PriceScaleIdContext";
import { PriceScaleRefContext } from "../context/PriceScaleRefContext";
import { useChartContext } from "../context/ChartContext";
import { useChartTimeScaleFit } from "../hooks/useChartTimeScaleFit";

export interface PriceScaleProps extends DeepPartial<PriceScaleOptions> {
  id: string;
  priceScaleRef?: RefObject<IPriceScaleRef>;
  children?: ReactNode;
}

export const PriceScale = memo(
  ({
    id,
    priceScaleRef: propPriceScaleRef,
    children,
    ...options
  }: PriceScaleProps) => {
    const chartRef = useChartRefContext();
    const { resizable } = useChartContext();

    const { priceScaleRef } = usePriceScaleApi({
      id,
      chartRef,
      options,
    });

    useChartTimeScaleFit({ chartRef, enabled: resizable });
    useImperativeHandle(propPriceScaleRef, () => priceScaleRef.current);

    return (
      <PriceScaleIdContext.Provider value={id}>
        <PriceScaleRefContext.Provider value={priceScaleRef}>
          {children}
        </PriceScaleRefContext.Provider>
      </PriceScaleIdContext.Provider>
    );
  }
);
