import { MetricResult, MetricCatalogItem } from "@api/types/index";

export interface AnalystData {
  id: string;
  analystName: string;
  analystAvatar: string;
  primaryExposure: number;
  primaryPnLPct: number;
  secondaryExposure: number;
  secondaryPnLPct: number;
  [key: string]: string | number;
}

export interface AnalystBreakdownData {
  id: string;
  [key: string]: string | number;
}

export const transformAnalystBreakdownData = (
  data: MetricResult[],
  benchmarkIds: string[],
  metrics: MetricCatalogItem[]
): AnalystBreakdownData[] => {
  if (!data || data.length === 0) return [];

  const baseData = data[0]?.data || [];

  if (baseData.length === 0) return [];

  const analyst = baseData[0].primary_analyst
    ? "primary_analyst"
    : "secondary_analyst";

  const transformedData: AnalystBreakdownData[] = baseData.map((item) => {
    const baseRow: AnalystBreakdownData = {
      id: String(item[analyst]),
    };

    metrics.forEach((metric) => {
      if (item[metric.name] !== undefined) {
        baseRow[metric.name] = item[metric.name] as string | number;
      }
    });

    data.forEach((benchmarkData, index) => {
      const benchmarkId = benchmarkIds[index];
      const analystDataForBenchmark = benchmarkData.data?.find(
        (d) => d[analyst] === item[analyst]
      );

      if (analystDataForBenchmark && benchmarkId) {
        const alphaPnlValue =
          analystDataForBenchmark.cumulative_alpha_pnl_percent;
        if (alphaPnlValue !== undefined) {
          baseRow[`${benchmarkId}`] = Number(alphaPnlValue);
        }
      }
    });

    return baseRow;
  });

  return transformedData;
};
