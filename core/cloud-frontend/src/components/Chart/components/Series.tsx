import { memo, ReactNode, Ref, useImperativeHandle } from "react";
import {
  SeriesDataItemTypeMap,
  SeriesPartialOptionsMap,
  SeriesType,
  Time,
} from "lightweight-charts";
import { SeriesRefContext } from "../context/SeriesRefContext";
import { useSeriesApi } from "../hooks/useSeriesApi";
import { ISeriesRef } from "../typings/ISeriesRef";
import { useChartRefContext } from "../context/ChartRefContext";
import { useRegisterSeriesTooltip } from "../hooks/useRegisterSeriesTooltip";
import { useRegisterSeriesPriority } from "../hooks/useRegisterSeriesPriority";
import { createSeries } from "../helpers/createSeries";
import { usePriceScaleId } from "../context/PriceScaleIdContext";
import { usePriceScaleRefContext } from "../context/PriceScaleRefContext";
import { useChartContext } from "../context/ChartContext";
import { useChartTimeScaleFit } from "../hooks/useChartTimeScaleFit";

export type SeriesProps<T extends SeriesType> = SeriesPartialOptionsMap[T] & {
  type: T;
  seriesRef?: Ref<ISeriesRef>;
  data: SeriesDataItemTypeMap<Time>[T][];
  priority?: boolean;
  children?: ReactNode;
};

export const Series = memo(
  <T extends SeriesType>({
    data,
    type,
    seriesRef: propSeriesRef,
    priority,
    children,
    ...options
  }: SeriesProps<T>) => {
    const priceScaleId = usePriceScaleId();
    const { resizable } = useChartContext();
    const priceScaleRef = usePriceScaleRefContext();
    const chartRef = useChartRefContext();

    const { seriesRef } = useSeriesApi({
      type,
      data,
      options,
      chartRef,
      priceScaleId,
      priceScaleRef,
    });

    useChartTimeScaleFit({ chartRef, enabled: resizable });
    useRegisterSeriesTooltip({ seriesRef });
    useRegisterSeriesPriority({ seriesRef, priority });
    useImperativeHandle(propSeriesRef, () => seriesRef.current);

    return (
      <SeriesRefContext.Provider value={seriesRef}>
        {children}
      </SeriesRefContext.Provider>
    );
  }
);

export const LineSeries = createSeries("Line");
export const BarSeries = createSeries("Bar");
export const CandlestickSeries = createSeries("Candlestick");
export const AreaSeries = createSeries("Area");
export const HistogramSeries = createSeries("Histogram");
export const BaselineSeries = createSeries("Baseline");
