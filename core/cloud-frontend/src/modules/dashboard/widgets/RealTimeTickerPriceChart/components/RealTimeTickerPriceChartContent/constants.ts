export interface DateRangeOption {
  value: DateRange;
  label: string;
}

export type DateRange = "DTD" | "MTD" | "QTD" | "YTD";

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  {
    value: "DTD",
    label: "DTD",
  },
  {
    value: "MTD",
    label: "MTD",
  },
  {
    value: "QTD",
    label: "QTD",
  },
  {
    value: "YTD",
    label: "YTD",
  },
];

export const mapDateRangeToMetric = (dateRange: DateRange) => {
  switch (dateRange) {
    case "MTD":
      return "market_price_history_mtd_bbg";
    case "QTD":
      return "market_price_history_qtd_bbg";
    case "YTD":
      return "market_price_history_ytd_bbg";
    default:
      return "market_price_history_mtd_bbg";
  }
};
