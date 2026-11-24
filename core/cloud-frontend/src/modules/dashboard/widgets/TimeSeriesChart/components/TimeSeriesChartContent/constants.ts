export interface DateRangeOption {
  value: DateRange;
  label: string;
}

export type DateRange = "MTD" | "QTD" | "YTD";

export type MetricType = "enterprise_value" | "market_cap";

export interface MetricTypeOption {
  value: MetricType;
  label: string;
}

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
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

export const METRIC_TYPE_OPTIONS: MetricTypeOption[] = [
  {
    value: "enterprise_value",
    label: "Enterprise Value",
  },
  {
    value: "market_cap",
    label: "Market Cap",
  },
];

export const mapDateRangeToMetric = (
  dateRange: DateRange,
  metricType: MetricType
) => {
  switch (metricType) {
    case "enterprise_value":
      switch (dateRange) {
        case "MTD":
          return "enterprise_value_history_mtd_bbg";
        case "QTD":
          return "enterprise_value_history_qtd_bbg";
        case "YTD":
          return "enterprise_value_history_ytd_bbg";
        default:
          return "enterprise_value_history_mtd_bbg";
      }
    case "market_cap":
      switch (dateRange) {
        case "MTD":
          return "market_cap_history_mtd_bbg";
        case "QTD":
          return "market_cap_history_qtd_bbg";
        case "YTD":
          return "market_cap_history_ytd_bbg";
        default:
          return "market_cap_history_mtd_bbg";
      }
    default:
      return "enterprise_value_history_mtd_bbg";
  }
};
