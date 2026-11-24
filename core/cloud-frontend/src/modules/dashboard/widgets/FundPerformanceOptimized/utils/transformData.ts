import { BenchmarkAndFundPerformanceStats } from "@api/types";

const FUND_NAMES = new Set(["Northstar Capital", "Harbor Ridge Partners"]);

export interface FundPerformanceRow extends Record<string, unknown> {
  name: string;
  isLastFund?: boolean;
}

export const transformFundPerformanceResponse = (
  data: BenchmarkAndFundPerformanceStats[]
): FundPerformanceRow[] => {
  if (!data?.length) return [];

  const lastFundIndex = data.reduce(
    (last, item, index) => (FUND_NAMES.has(item.name) ? index : last),
    -1
  );

  return data.map((item, index) => ({
    ...item,
    isLastFund: index === lastFundIndex,
  }));
};
