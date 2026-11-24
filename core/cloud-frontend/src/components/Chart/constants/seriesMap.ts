import {
  LineSeries,
  SeriesType,
  SeriesDefinition,
  BarSeries,
  CandlestickSeries,
  AreaSeries,
  HistogramSeries,
  BaselineSeries,
} from "lightweight-charts";

export const seriesMap: Partial<
  Record<SeriesType, SeriesDefinition<SeriesType>>
> = {
  Line: LineSeries,
  Bar: BarSeries,
  Candlestick: CandlestickSeries,
  Area: AreaSeries,
  Histogram: HistogramSeries,
  Baseline: BaselineSeries,
};
