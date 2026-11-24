import { MetricDisplayType } from "@api/types/index";

import { billions, dollarsToUnit, millions } from "./currency";
import { formatNumber as formatNumberIntl } from "./number";

const MIN_PNL_VALUE = 10000;
const MIN_PERCENT_VALUE = 0.0001;

export type IMetricDisplayType =
  | MetricDisplayType
  | "dollars_regular"
  | "currency";
export interface FormatMetricOptions {
  digits?: number;
}
export interface IFormatMetricProps {
  value: unknown;
  displayType: IMetricDisplayType;
}

export const formatMetric = (
  value: IFormatMetricProps["value"],
  displayType: IFormatMetricProps["displayType"],
  options?: FormatMetricOptions
): string => {
  if (value === undefined || value === null) return "-";
  const digits = options?.digits ?? 2;

  switch (displayType) {
    case MetricDisplayType.percent:
      return formatPercent(Number(value), digits);
    case MetricDisplayType.dollars:
      return formatDollars(Number(value), digits);
    case MetricDisplayType.pnl:
      return formatPnl(Number(value), digits);
    case MetricDisplayType.string:
      return formatString(String(value));
    case MetricDisplayType.integer:
      return formatInteger(Number(value));
    case MetricDisplayType.float:
      return formatFloat(Number(value), digits);
    case MetricDisplayType.ratio:
      return formatRatio(Number(value));
    case MetricDisplayType.percent_no_decimals:
      return formatPercentNoDecimals(Number(value));
    case "currency": {
      const numValue = Number(value);
      const absValue = Math.abs(numValue);
      if (absValue >= 1_000_000) {
        const sign = numValue < 0 ? "-" : "";
        return `${sign}$${formatLargeNumber(absValue, digits)}`;
      }
      return `$${formatFloat(numValue, digits)}`;
    }
    case "dollars_regular":
      return `$${formatFloat(Number(value), digits)}`;
    default:
      return String(value);
  }
};

const formatPercent = (value: number, digits: number) =>
  `${Math.abs(value) >= MIN_PERCENT_VALUE && value < 0 ? "-" : ""}${formatFloat(Math.abs(value * 100), digits)}%`;

const formatDollars = (value: number, digits: number) =>
  `${Math.abs(value) >= MIN_PNL_VALUE && value < 0 ? "-" : ""}${formatLargeNumber(Math.abs(value), digits)}`;

const formatPnl = (value: number, digits: number) =>
  `${Math.abs(value) >= MIN_PNL_VALUE ? (value > 0 ? "+" : "-") : ""}${formatLargeNumber(Math.abs(value), digits)}`;

const formatString = (value: string) => value;

const formatFloat = (value: number, digits: number): string =>
  formatNumberIntl(Number(value.toFixed(digits)), digits);

const formatInteger = (value: number): string =>
  formatNumberIntl(Number(value.toFixed(0)), 0);

const formatPercentNoDecimals = (value: number) =>
  `${Math.abs(value) >= MIN_PERCENT_VALUE && value < 0 ? "-" : ""}${Math.round(Math.abs(value * 100))}%`;

const formatRatio = (value: number) => `${Math.round(value * 10) / 10}x`;

export const formatLargeNumber = (value: number, digits: number = 2) => {
  const absValue = Math.abs(value);
  let formattedValue = dollarsToUnit(value, millions);
  let suffix = "M";

  if (absValue > 1000000000) {
    formattedValue = dollarsToUnit(value, billions);
    suffix = "B";
  }

  return `${formatFloat(formattedValue, digits)}${suffix}`;
};

export const getValueStatusForMetric = function ({
  direction,
  value,
  metric,
}: {
  direction?: string;
  value: unknown;
  metric?: {
    display_type: MetricDisplayType;
  };
}): "positive" | "negative" | "neutral" {
  if (direction?.toLowerCase().includes("long")) {
    return "positive";
  }

  if (
    direction?.toLowerCase().includes("short") ||
    direction?.toLowerCase().includes("loss %")
  ) {
    return "negative";
  }

  if (
    typeof value === "number" &&
    metric?.display_type === MetricDisplayType.pnl &&
    Math.abs(value) >= MIN_PNL_VALUE
  ) {
    if (value > 0) {
      return "positive";
    } else if (value < 0) {
      return "negative";
    }
  }

  if (metric?.display_type === MetricDisplayType.percent) {
    if (Number(value) > 0) {
      return "positive";
    } else if (Number(value) < 0) {
      return "negative";
    }
  }

  return "neutral";
};
