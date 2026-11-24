import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { RealTimeTickerPriceChartContent } from "./components/RealTimeTickerPriceChartContent";

export const RealTimeTickerPriceChart = withAppInsights(
  RealTimeTickerPriceChartContent,
  "RealTimeTickerPriceChart"
);
