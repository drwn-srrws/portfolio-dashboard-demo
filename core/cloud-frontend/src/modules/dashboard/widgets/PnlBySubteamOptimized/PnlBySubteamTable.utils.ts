import { PnlBySubteamRow } from "@/api/types";

export const DEFAULT_BENCHMARK_ID = "XBI US Equity";

const BENCHMARK_SHORT_NAMES: Record<string, string> = {
  "SPX Index": "SPX",
  "CCMP Index": "CCMP",
  "IWM US Equity": "IWM US",
  "RGUSHSBT Index": "RGUSHSBT",
  "XBI US Equity": "XBI",
  "NBI Index": "NBI",
  "DRG Index": "DRG",
  "DJSMDQT Index": "DJSMDQT",
  "RGUSHSME Index": "RGUSHSME",
  "XHE US Equity": "XHE US",
};

export const getBenchmarkShortName = (benchmarkId: string): string =>
  BENCHMARK_SHORT_NAMES[benchmarkId] ?? benchmarkId;

export interface ParsedUser {
  email: string;
  first_name: string;
  last_name: string;
}

export interface PnlBySubteamTableRow {
  uniqueId: string;
  team_lead: ParsedUser | null;
  team_members: ParsedUser[];
  average_net_exposure: number | null;
  cumulative_group_pnl_percent: number | null;
  alpha: number | null;
  cumulative_pnl_percent_nav: number | null;
  cumulative_pnl: number | null;
}

export const parseAvatar = (avatar?: string | null): ParsedUser | null => {
  if (!avatar) return null;
  const [email = "", first_name = "", last_name = ""] = avatar.split("|");
  if (!email && !first_name && !last_name) return null;
  return { email, first_name, last_name };
};

const parseAvatarList = (avatars?: string | null): ParsedUser[] => {
  if (!avatars) return [];
  return avatars
    .split(",")
    .map((entry) => parseAvatar(entry.trim()))
    .filter((user): user is ParsedUser => user !== null);
};

export const transformPnlBySubteamResponse = (
  data: PnlBySubteamRow[],
  benchmarkId: string
): PnlBySubteamTableRow[] => {
  return data.map((row, index) => {
    const lead = parseAvatar(row.team_lead_avatar);
    return {
      uniqueId: `${benchmarkId}-${row.team_lead_avatar ?? `row-${index}`}`,
      team_lead: lead,
      team_members: parseAvatarList(row.team_members_avatars),
      average_net_exposure: row.average_net_exposure ?? null,
      cumulative_group_pnl_percent: row.cumulative_group_pnl_percent ?? null,
      alpha: row.alpha ?? null,
      cumulative_pnl_percent_nav: row.cumulative_pnl_percent_nav ?? null,
      cumulative_pnl: row.cumulative_pnl ?? null,
    };
  });
};

export const formatUserFullName = (user: ParsedUser): string =>
  [user.first_name, user.last_name].filter(Boolean).join(" ").trim() ||
  user.email;
