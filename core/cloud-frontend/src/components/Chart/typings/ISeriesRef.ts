import { ISeriesApi, SeriesType } from "lightweight-charts";

export interface ISeriesRef {
  api: ISeriesApi<SeriesType> | null;
  create: (this: ISeriesRef) => void;
  dispose: (this: ISeriesRef) => void;
}
