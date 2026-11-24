import { format } from "date-fns";
import { parseDateString } from "@/utils/dates";

export const ivolAsOfSuffix = (asOfDt: string | null | undefined) => {
  if (!asOfDt) return "";
  const date = parseDateString(asOfDt);
  return date ? ` (as of ${format(date, "MMM d")})` : "";
};

const MAX_UI_VALUE = 190;

/** Mirrors PercentageBar/EventEstimateBar's fill-width math so a marker lands on the same scale as the bar. */
export const getBarOffsetPercent = (value: number, coefficient: number) =>
  (Math.min(Math.abs(value * 100), MAX_UI_VALUE) / 100) * coefficient;
