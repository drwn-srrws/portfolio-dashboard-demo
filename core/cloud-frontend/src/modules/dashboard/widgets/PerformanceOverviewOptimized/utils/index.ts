export { transformToChartData } from "./transformData";

export const isAlphaMetric = (metricName: string): boolean =>
  metricName.includes("alpha");
