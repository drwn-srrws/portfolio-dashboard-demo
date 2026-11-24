import { AnalystStats } from "@/api/types";
import { BattingSluggingResponse } from "@api/types/index";

export interface BattingSluggingRowData extends AnalystStats {
  uniqueIds: string[];
  fieldHeader?: string;
  [key: string]: unknown;
}

export const parseAvatar = (avatarString?: string | null) => {
  if (!avatarString) return null;
  const [email, first_name, last_name] = String(avatarString).split("|");
  return { email, first_name, last_name };
};

export const buildNestedRows = (
  responses: BattingSluggingResponse[]
): BattingSluggingRowData[] => {
  const rows: BattingSluggingRowData[] = [];

  for (const result of responses) {
    const groupByFields = result.metadata?.group_by ?? [];

    for (const dataRow of result.data ?? []) {
      const row = dataRow as unknown as Record<string, unknown>;
      const uniqueIds = groupByFields.map((field) => String(row[field] ?? ""));
      const fieldHeader = uniqueIds[uniqueIds.length - 1] ?? "";

      rows.push({ ...(dataRow as AnalystStats), uniqueIds, fieldHeader });
    }
  }

  return rows;
};

export const getDisplayColumnsFromResponse = (
  responses: BattingSluggingResponse[]
): string[] => {
  const cols = new Set<string>();
  for (const result of responses) {
    for (const col of result.metadata?.display_columns ?? []) cols.add(col);
  }
  return [...cols];
};

export const getGroupingFieldsFromResponse = (
  responses: BattingSluggingResponse[]
): string[] => {
  const last = responses[responses.length - 1];
  return last?.metadata?.group_by ?? [];
};

const toNumberOrNull = (v: unknown): number | null => {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export const computeTotalFromResponses = (
  responses: BattingSluggingResponse[],
  effectiveGroupBy: string
): AnalystStats | undefined => {
  const topLevel =
    responses.find((r) => {
      const g = r.metadata?.group_by ?? [];
      return g.length === 1 && g[0] === effectiveGroupBy;
    }) ?? responses[0];

  const rows = (topLevel?.data ?? []) as AnalystStats[];
  if (!rows.length) return undefined;

  let totalTrades = 0;
  let wins = 0;
  let losses = 0;

  let winWeightedSum = 0;
  let winWeight = 0;
  let lossWeightedSum = 0;
  let lossWeight = 0;

  for (const r of rows) {
    const t = toNumberOrNull(r.total_number_of_trades) ?? 0;
    const w = toNumberOrNull(r.number_of_wins) ?? 0;
    const l = toNumberOrNull(r.number_of_losses) ?? 0;

    totalTrades += t;
    wins += w;
    losses += l;

    const avgWin = toNumberOrNull(r.avg_win_pnl_percent_nav);
    if (avgWin !== null && w > 0) {
      winWeightedSum += avgWin * w;
      winWeight += w;
    }

    const avgLoss = toNumberOrNull(r.avg_loss_pnl_percent_nav);
    if (avgLoss !== null && l > 0) {
      lossWeightedSum += avgLoss * l;
      lossWeight += l;
    }
  }

  const avgWinTotal = winWeight > 0 ? winWeightedSum / winWeight : null;
  const avgLossTotal = lossWeight > 0 ? lossWeightedSum / lossWeight : null;

  const hitRateTotal = totalTrades > 0 ? wins / totalTrades : null;
  const sluggingTotal =
    avgWinTotal !== null &&
    avgLossTotal !== null &&
    avgLossTotal !== 0 &&
    Number.isFinite(avgWinTotal) &&
    Number.isFinite(avgLossTotal)
      ? avgWinTotal / Math.abs(avgLossTotal)
      : null;

  return {
    total_number_of_trades: totalTrades,
    number_of_wins: wins,
    number_of_losses: losses,
    hit_rate: hitRateTotal as AnalystStats["hit_rate"],
    slugging_ratio: sluggingTotal as AnalystStats["slugging_ratio"],
    avg_win_pnl_percent_nav:
      avgWinTotal as AnalystStats["avg_win_pnl_percent_nav"],
    avg_loss_pnl_percent_nav:
      avgLossTotal as AnalystStats["avg_loss_pnl_percent_nav"],
  };
};

export const createTotalRow = (
  totalData: AnalystStats | undefined
): BattingSluggingRowData[] =>
  totalData
    ? [{ ...totalData, uniqueIds: ["Total"], fieldHeader: "Total" }]
    : [];
