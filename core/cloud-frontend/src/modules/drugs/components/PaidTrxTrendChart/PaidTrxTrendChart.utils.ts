import type { MetricSeries } from "@api/types";

/**
 * The period value the backend uses for the "all history" timeframe. The UI
 * surfaces this as "ALL" to match the product spec wording.
 */
export const ALL_PERIOD = "ITD";
export const CUSTOM_PERIOD = "CUSTOM";

/** Default timeframe used until the chart config resolves. */
export const FALLBACK_PERIOD = "YTD";

/** Periods used until the chart config endpoint resolves. */
export const FALLBACK_PERIODS = ["MTD", "QTD", "YTD", "1Y", ALL_PERIOD];

export const FALLBACK_TEMPLATE = "paid_trx";

export const FALLBACK_TEMPLATE_LABEL_MAP: Record<string, string> = {
  paid_trx: "Paid TRx",
  paid_nbrx: "Paid New Patients",
  paid_patients: "Paid Patients",
  total_prescribed_patients: "Total Patients",
};

/** Human label for a backend period value. */
export const periodLabel = (period: string): string => {
  if (period === ALL_PERIOD) return "ALL";
  if (period === CUSTOM_PERIOD) return "Custom";
  return period;
};

/**
 * Same-Time-Last-Year is only meaningful for bounded periods. It is disabled
 * for the unbounded ALL/ITD range and for custom date ranges.
 */
export const isStlyAllowed = (period: string): boolean =>
  period !== ALL_PERIOD && period !== CUSTOM_PERIOD;

/** Distinct line colors assigned to vendor/source series by order. */
export const TRX_SERIES_COLORS = [
  "#27B9D5",
  "#E68257",
  "#AB47BD",
  "#5C6BC0",
  "#66BB6A",
  "#EF5350",
  "#FFA726",
  "#26A69A",
  "#EC407A",
  "#8D6E63",
];

const trxFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

/** Format a Paid TRx value (counts) with thousands separators. */
export const formatTrx = (value: number): string => trxFormatter.format(value);

export interface DrugChartPoint {
  time: string;
  value: number;
}

export interface DrugChartLine {
  /** Metric name; doubles as the series id. */
  id: string;
  name: string;
  color: string;
  /** Solid, realized portion of the series. */
  actual: DrugChartPoint[];
  /** Dashed forecast continuation (bridged from the last actual point). */
  forecast: DrugChartPoint[];
  /** Dotted prior-year overlay, shifted forward one year to align visually. */
  prior: DrugChartPoint[];
}

/** Shift an ISO `YYYY-MM-DD` date forward by `years` years. */
const shiftYear = (date: string, years: number): string => {
  const [year, month, day] = date.split("-").map(Number);
  const targetYear = year + years;
  const shifted = new Date(Date.UTC(targetYear, month - 1, day));
  // JS overflows invalid days into the next month (e.g. Feb 29 -> Mar 1 in a
  // non-leap year), which would push the point out of weekly sequence. Clamp
  // back to the last valid day of the intended month (Feb 29 -> Feb 28).
  if (shifted.getUTCMonth() !== month - 1) {
    return new Date(Date.UTC(targetYear, month, 0)).toISOString().slice(0, 10);
  }
  return shifted.toISOString().slice(0, 10);
};

const sortByTime = (points: DrugChartPoint[]): DrugChartPoint[] =>
  [...points].sort((a, b) => a.time.localeCompare(b.time));

export interface BuildLinesOptions {
  showForecast: boolean;
  includeStly: boolean;
}

/**
 * Convert the API series into render-ready lines. Each metric becomes up to
 * three line segments: a solid actual line, a dashed forecast continuation,
 * and a dotted prior-year overlay (shifted +1y so it aligns with the current
 * window). Colors are assigned by the metric's position in `series`.
 */
export const buildDrugChartLines = (
  series: MetricSeries[],
  { showForecast, includeStly }: BuildLinesOptions
): DrugChartLine[] =>
  series.map((metricSeries, index) => {
    const color = TRX_SERIES_COLORS[index % TRX_SERIES_COLORS.length];

    const actual = sortByTime(
      metricSeries.current_series
        .filter((point) => point.value !== null && !point.is_forecast)
        .map((point) => ({ time: point.date, value: point.value as number }))
    );

    const lastActual = actual.length > 0 ? actual[actual.length - 1] : null;

    const forecastPoints = sortByTime(
      metricSeries.current_series
        .filter(
          (point) =>
            point.value !== null &&
            point.is_forecast &&
            (!lastActual || point.date > lastActual.time)
        )
        .map((point) => ({ time: point.date, value: point.value as number }))
    );

    const forecastSegment =
      showForecast && forecastPoints.length > 0
        ? [...(lastActual ? [lastActual] : []), ...forecastPoints]
        : [];

    const forecast =
      forecastSegment.length > 1 ||
      (actual.length === 0 && forecastSegment.length > 0)
        ? forecastSegment
        : [];

    let prior: DrugChartPoint[] = [];
    if (includeStly && metricSeries.prior_series) {
      prior = sortByTime(
        metricSeries.prior_series
          .filter((point) => point.value !== null)
          .map((point) => ({
            time: shiftYear(point.date, 1),
            value: point.value as number,
          }))
      );
    }

    return {
      id: metricSeries.metric,
      name: metricSeries.metric,
      color,
      actual,
      forecast,
      prior,
    };
  });
