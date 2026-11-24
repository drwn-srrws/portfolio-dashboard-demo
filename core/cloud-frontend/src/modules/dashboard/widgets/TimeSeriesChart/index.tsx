import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { TimeSeriesChartContent } from "./components/TimeSeriesChartContent";

export const TimeSeriesChart = withAppInsights(
  TimeSeriesChartContent,
  "TimeSeriesChart"
);
