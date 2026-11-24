import { CompanyTrend } from "@api/types/index";

interface SeriesConfig {
  color: string;
  initialX: number;
  format: (value: string) => string;
}

export const formatNumbers = (value: string): string => {
  const num = Number(value);

  if (Math.abs(num) >= 1e6) {
    return (num / 1e6).toFixed(2) + "M";
  }

  return String(num.toFixed(2));
};

export const formatPercentage = (value: string): string => {
  return (Number(value) * 100).toFixed(2) + "%";
};

export const seriesConfig: Record<CompanyTrend, SeriesConfig> = {
  [CompanyTrend.price]: {
    color: "#1A73E8",
    initialX: -80,
    format: formatNumbers,
  },
  [CompanyTrend.size]: {
    color: "#E68257",
    initialX: 180,
    format: formatPercentage,
  },
  [CompanyTrend.ytd_pnl]: {
    color: "#27B9D5",
    initialX: 180,
    format: formatNumbers,
  },
};

export const trendOptions = [
  { label: "Price", value: CompanyTrend.price },
  { label: "Size", value: CompanyTrend.size },
  { label: "YTD PnL", value: CompanyTrend.ytd_pnl },
];
