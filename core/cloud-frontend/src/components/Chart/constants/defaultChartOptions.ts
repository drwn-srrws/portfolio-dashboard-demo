import { ChartOptions, DeepPartial } from "lightweight-charts";

export const defaultChartOptions: DeepPartial<ChartOptions> = {
  autoSize: true,
  layout: {
    background: { color: "transparent" },
    textColor: "#FFFFFF",
    fontSize: 9,
  },
  grid: {
    vertLines: { color: "#222323" },
    horzLines: { color: "#222323" },
  },
  rightPriceScale: {
    borderColor: "#262626",
  },
  leftPriceScale: {
    borderColor: "#262626",
  },
  timeScale: {
    borderColor: "transparent",
  },
};
