import { equals } from "ramda";
import { RefObject, useEffect, useRef } from "react";
import {
  SeriesDataItemTypeMap,
  SeriesPartialOptionsMap,
  SeriesType,
  Time,
} from "lightweight-charts";
import { IChartRef } from "../typings/IChartRef";
import { IPriceScaleRef } from "../typings/IPriceScaleRef";
import { seriesMap } from "../constants/seriesMap";
import { ISeriesRef } from "../typings/ISeriesRef";
import { diff } from "../helpers/diff";

export interface UseSeriesApiOptions<T extends SeriesType> {
  type: T;
  data: SeriesDataItemTypeMap<Time>[T][];
  options: SeriesPartialOptionsMap[T];
  chartRef: RefObject<IChartRef>;
  priceScaleId: string;
  priceScaleRef: RefObject<IPriceScaleRef>;
}

export const useSeriesApi = <T extends SeriesType>({
  type,
  data,
  options,
  chartRef,
  priceScaleId,
  priceScaleRef,
}: UseSeriesApiOptions<T>) => {
  const seriesRef = useRef<ISeriesRef>({
    api: null,
    create() {
      if (this.api || !chartRef.current.api) return;

      const series = seriesMap[type];

      if (!series) throw new Error(`This series type not supported: ${type}`);

      const api = chartRef.current.api.addSeries(series, {
        ...options,
        priceScaleId,
      });

      this.api = api;
    },
    dispose() {
      if (!this.api) return;
      chartRef.current.api?.removeSeries(this.api);
      this.api = null;
    },
  });

  useEffect(() => {
    const currentSeriesRef = seriesRef.current;
    const currentChartRef = chartRef.current;

    currentChartRef.create();
    currentSeriesRef.create();

    return () => {
      currentSeriesRef.dispose();
    };
  }, [chartRef, priceScaleRef]);

  useEffect(() => {
    if (!equals(seriesRef.current.api?.data(), data)) {
      seriesRef.current.api?.setData(data);
      chartRef.current.api?.timeScale().fitContent();
    }
  }, [chartRef, data]);

  useEffect(() => {
    seriesRef.current.api?.applyOptions(
      diff(seriesRef.current.api.options() as typeof options, {
        ...options,
        priceScaleId,
      })
    );
  }, [chartRef, options, priceScaleId]);

  return { seriesRef };
};
