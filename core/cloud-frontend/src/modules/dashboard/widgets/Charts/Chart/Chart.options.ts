import { ChartOptions, ColorType, DeepPartial } from "lightweight-charts";

export const chartOptions: DeepPartial<ChartOptions> = {
  layout: {
    textColor: "#ffffff",
    background: { type: ColorType.Solid, color: "#000000" },
  },
  grid: {
    vertLines: {
      visible: false,
    },
    horzLines: {
      visible: false,
    },
  },
  rightPriceScale: {
    visible: true,
  },
  leftPriceScale: {
    visible: true,
  },
  timeScale: {
    timeVisible: true,
    borderVisible: false,
  },
  autoSize: true,
};
