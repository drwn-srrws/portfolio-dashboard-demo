import { IChartApi } from "lightweight-charts";

export interface IChartRef {
  api: IChartApi | null;
  create: (this: IChartRef) => void;
  dispose: (this: IChartRef) => void;
}
