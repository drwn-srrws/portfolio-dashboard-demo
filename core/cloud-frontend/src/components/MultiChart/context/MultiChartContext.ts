import { IChartApi } from "lightweight-charts";
import { createContext, MutableRefObject, useContext } from "react";

import { ChartRef } from "../hooks/useChart";

export interface IChartContext {
  chartApi: IChartApi;
  chartRef: MutableRefObject<ChartRef>;
}

export const ChartContext = createContext<IChartContext>({
  chartApi: null as unknown as IChartApi,
  chartRef: null as unknown as MutableRefObject<ChartRef>,
});

export const ChartProvider = ChartContext.Provider;

export const useChartContext = () => useContext(ChartContext);
