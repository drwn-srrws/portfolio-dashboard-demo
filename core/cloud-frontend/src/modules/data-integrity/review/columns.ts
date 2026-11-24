/**
 * Per-check display columns for the review tables.
 *
 * Curated to the high-signal columns the reviewer needs to decide
 * Valid vs Open (mirroring the design mockup) — the full Excel sheet (with
 * Security Code, Mean/Std, spike dates, etc.) remains the exhaustive record.
 *
 * Number units (confirmed against the check implementations):
 *   - Daily PnL / SOD GMV / SOD NAV : currency. PnL shown in full; exposures
 *     humanised to K/M/B.
 *   - PnL % GMV / PnL % NAV         : ratios (pnl / exposure) → ×100 + "%".
 *   - Prior/Current GMV % NAV       : already ×100 percentages → append "%".
 *   - Divergence %                  : already a percentage → append "%".
 */
import type { ColDef } from "@ag-grid-community/core";

import type { FlagOut } from "./api";

export interface ReviewColumn {
  header: string;
  /** Right-align numeric columns. */
  numeric?: boolean;
  /** Highlight the check's headline metric column. */
  hot?: boolean;
  value: (flag: FlagOut) => string;
}

const DASH = "—";

const isNum = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);

const ctxNum = (flag: FlagOut, key: string): number | null => {
  const v = flag.context?.[key];
  return isNum(v) ? v : null;
};

/** Full number with thousands separators (e.g. -1,240,500). */
const num = (v: number | null): string =>
  v === null ? DASH : v.toLocaleString("en-US", { maximumFractionDigits: 0 });

/** Humanised magnitude for exposures (e.g. 18,200,000 → 18.2M). */
const compact = (v: number | null): string => {
  if (v === null) return DASH;
  const abs = Math.abs(v);
  if (abs >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
  return v.toLocaleString("en-US", { maximumFractionDigits: 0 });
};

/** Ratio rendered as a percentage (e.g. -0.068 → -6.8%). */
const pctRatio = (v: number | null): string =>
  v === null ? DASH : `${(v * 100).toFixed(1)}%`;

/** Value that is already a percentage (e.g. 182 → 182%). */
const pctValue = (v: number | null): string =>
  v === null
    ? DASH
    : `${v.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;

/** Fixed-decimal number for z-scores / magnitudes (e.g. -4.12). */
const dec = (v: number | null, digits = 2): string =>
  v === null ? DASH : v.toFixed(digits);

/** Price with 2 decimals. */
const price = (v: number | null): string => (v === null ? DASH : v.toFixed(2));

const str = (v: unknown): string =>
  v === null || v === undefined || v === "" ? DASH : String(v);

const FUND: ReviewColumn = { header: "Fund", value: (f) => str(f.fund_name) };
const INSTRUMENT: ReviewColumn = {
  header: "Instrument",
  value: (f) => str(f.instrument_name),
};
const ENFUSION_ID: ReviewColumn = {
  header: "Enfusion ID",
  numeric: true,
  value: (f) => str(f.enfusion_id),
};
const DATE: ReviewColumn = { header: "Date", value: (f) => str(f.flag_date) };

export const REVIEW_COLUMNS: Record<string, ReviewColumn[]> = {
  PNL_FUND_ZSCORE: [
    FUND,
    DATE,
    { header: "Daily PnL", numeric: true, value: (f) => num(f.pnl_value) },
    { header: "SOD NAV", numeric: true, value: (f) => compact(f.nav_value) },
    {
      header: "PnL % NAV",
      numeric: true,
      value: (f) => pctRatio(ctxNum(f, "pnl_pct_nav")),
    },
    {
      header: "Z-Score",
      numeric: true,
      hot: true,
      value: (f) => dec(f.metric_value),
    },
  ],
  PNL_POSITION_ZSCORE: [
    FUND,
    INSTRUMENT,
    ENFUSION_ID,
    DATE,
    { header: "Daily PnL", numeric: true, value: (f) => num(f.pnl_value) },
    {
      header: "SOD GMV",
      numeric: true,
      value: (f) => compact(f.exposure_value),
    },
    {
      header: "PnL % GMV",
      numeric: true,
      value: (f) => pctRatio(ctxNum(f, "pnl_pct_gmv")),
    },
    {
      header: "Z-Score",
      numeric: true,
      hot: true,
      value: (f) => dec(f.metric_value),
    },
  ],
  PNL_POSITION_SWING: [
    FUND,
    INSTRUMENT,
    ENFUSION_ID,
    { header: "Window Start", value: (f) => str(f.context?.window_start) },
    { header: "Window End", value: (f) => str(f.context?.window_end) },
    { header: "Max Z", numeric: true, value: (f) => dec(ctxNum(f, "max_z")) },
    { header: "Min Z", numeric: true, value: (f) => dec(ctxNum(f, "min_z")) },
    {
      header: "Swing Magnitude",
      numeric: true,
      hot: true,
      value: (f) => dec(f.metric_value),
    },
  ],
  GMV_FUND_CHANGE: [
    FUND,
    DATE,
    {
      header: "Prior GMV % NAV",
      numeric: true,
      value: (f) => pctValue(ctxNum(f, "prior_gmv_pct_nav")),
    },
    {
      header: "Current GMV % NAV",
      numeric: true,
      value: (f) => pctValue(ctxNum(f, "current_gmv_pct_nav")),
    },
    {
      header: "Change (ppt)",
      numeric: true,
      hot: true,
      value: (f) => dec(f.metric_value, 1),
    },
  ],
  GMV_POSITION_CHANGE: [
    FUND,
    INSTRUMENT,
    ENFUSION_ID,
    DATE,
    {
      header: "Prior GMV % NAV",
      numeric: true,
      value: (f) => pctValue(ctxNum(f, "prior_gmv_pct_nav")),
    },
    {
      header: "Current GMV % NAV",
      numeric: true,
      value: (f) => pctValue(ctxNum(f, "current_gmv_pct_nav")),
    },
    {
      header: "Change (ppt)",
      numeric: true,
      hot: true,
      value: (f) => dec(f.metric_value, 1),
    },
  ],
  PRICE_DIVERGENCE: [
    INSTRUMENT,
    { header: "Ticker", value: (f) => str(f.context?.ticker) },
    ENFUSION_ID,
    DATE,
    {
      header: "BBG Price",
      numeric: true,
      value: (f) => price(f.bloomberg_price),
    },
    {
      header: "Enfusion Price",
      numeric: true,
      value: (f) => price(f.enfusion_price),
    },
    {
      header: "Divergence %",
      numeric: true,
      hot: true,
      value: (f) => pctValue(f.metric_value),
    },
  ],
};

/** Fallback for an unknown check type — show the headline metric only. */
export const DEFAULT_COLUMNS: ReviewColumn[] = [
  FUND,
  INSTRUMENT,
  DATE,
  {
    header: "Metric",
    numeric: true,
    hot: true,
    value: (f) => dec(f.metric_value),
  },
];

export const columnsFor = (checkType: string): ReviewColumn[] =>
  REVIEW_COLUMNS[checkType] ?? DEFAULT_COLUMNS;

/**
 * AG Grid display column defs for a check. Values reuse the `ReviewColumn.value`
 * formatters; numeric columns right-align (header + cell) and the headline
 * metric is highlighted. Sorting is disabled because the formatters return
 * display strings (a column sort would be lexical, not numeric) and the source
 * table never sorted. The interactive Valid/Open Status column is appended by
 * the page (it needs the decisions context), not here.
 */
export const colDefsFor = (checkType: string): ColDef<FlagOut>[] =>
  columnsFor(checkType).map((c) => ({
    headerName: c.header,
    valueGetter: (p) => (p.data ? c.value(p.data) : ""),
    type: c.numeric ? "rightAligned" : undefined,
    cellClass: c.hot ? "font-semibold text-orange-400" : undefined,
  }));
