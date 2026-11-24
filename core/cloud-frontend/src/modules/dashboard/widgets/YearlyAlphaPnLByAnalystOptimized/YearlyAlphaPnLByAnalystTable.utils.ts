import type {
  FilterBenchmarkCombo,
  LTDAlphaYearlyAlphaPerfResponseDataItem,
} from "@/api/types";
import {
  parseAvatar,
  type ParsedUser,
} from "@/modules/dashboard/widgets/PnlBySubteamOptimized/PnlBySubteamTable.utils";

export {
  formatUserFullName,
  getBenchmarkShortName,
} from "@/modules/dashboard/widgets/PnlBySubteamOptimized/PnlBySubteamTable.utils";
export type { ParsedUser } from "@/modules/dashboard/widgets/PnlBySubteamOptimized/PnlBySubteamTable.utils";

export const LTD_START_DATE = "2021-01-01";

export const TOTAL_COLUMN_KEY = "ALPHA PNL (% NMV)";

const YEAR_PATTERN = /^\d{4}$/;

export const isYearColumn = (column: string): boolean =>
  YEAR_PATTERN.test(column);

export interface YearlyAlphaPnLByAnalystTableRow {
  uniqueId: string;
  primary_analyst_name: string | null;
  primary_analyst: ParsedUser | null;
  yearValues: Record<string, number | null>;
  total: number | null;
}

export const transformYearlyAlphaPnLByAnalystResponse = (
  data: LTDAlphaYearlyAlphaPerfResponseDataItem[],
  scopeKey: string
): YearlyAlphaPnLByAnalystTableRow[] =>
  data.map((row, index) => {
    const avatar =
      typeof row.primary_analyst_avatar === "string"
        ? row.primary_analyst_avatar
        : null;
    const analystName =
      typeof row.primary_analyst === "string" ? row.primary_analyst : null;

    const yearValues: Record<string, number | null> = {};
    for (const [key, value] of Object.entries(row)) {
      if (!isYearColumn(key)) continue;
      yearValues[key] = typeof value === "number" ? value : null;
    }

    const rawTotal = row[TOTAL_COLUMN_KEY];
    const total = typeof rawTotal === "number" ? rawTotal : null;

    return {
      uniqueId: `${scopeKey}-${avatar ?? analystName ?? `row-${index}`}`,
      primary_analyst_name: analystName,
      primary_analyst: parseAvatar(avatar),
      yearValues,
      total,
    };
  });

export const matchBenchmarkCombo = (
  combos: FilterBenchmarkCombo[] | undefined,
  filters: Record<string, string[]>
): FilterBenchmarkCombo | null => {
  if (!combos?.length) return null;

  const cardEntries = Object.entries(filters)
    .filter(([, values]) => values.length > 0)
    .map(([key, values]) => [key, [...values].sort().join("|")] as const);

  const containsCardFilters = (combo: FilterBenchmarkCombo): boolean =>
    cardEntries.every(([key, joinedValue]) => {
      const raw = (combo.filters as Record<string, unknown>)[key];
      if (!Array.isArray(raw)) return false;
      const comboValues = raw.filter((v): v is string => typeof v === "string");
      return [...comboValues].sort().join("|") === joinedValue;
    });

  const candidates = combos.filter(containsCardFilters);
  if (!candidates.length) return null;

  return candidates.reduce((best, combo) =>
    Object.keys(combo.filters).length < Object.keys(best.filters).length
      ? combo
      : best
  );
};
