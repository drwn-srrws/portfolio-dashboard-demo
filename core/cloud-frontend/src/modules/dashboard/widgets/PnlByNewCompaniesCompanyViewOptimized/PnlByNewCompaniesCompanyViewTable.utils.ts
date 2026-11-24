import type {
  PnlByNewCompaniesCompanyRow,
  PnlByNewCompaniesCompanyTotals,
} from "@/api/types";
import {
  parseAvatar,
  type ParsedUser,
} from "@/modules/dashboard/widgets/PnlBySubteamOptimized/PnlBySubteamTable.utils";

export { formatUserFullName } from "@/modules/dashboard/widgets/PnlBySubteamOptimized/PnlBySubteamTable.utils";
export type { ParsedUser } from "@/modules/dashboard/widgets/PnlBySubteamOptimized/PnlBySubteamTable.utils";

export const DEFAULT_FUND_NAME = "Flagship";

export const PRIMARY_BENCHMARK_ID = "XBI US Equity";
export const SECONDARY_BENCHMARK_ID = "RGUSHSBT Index";

export const TOTAL_ROW_ID = "__total__";

export interface PnlByNewCompaniesCompanyViewTableRow {
  uniqueId: string;
  company_name: string;
  venture_analysts: ParsedUser[];
  venture_analyst_count: number | null;
  cumulative_pnl_percent_nav: number | null;
  cumulative_pnl: number | null;
  moic: number | null;
  xirr: number | null;
  holding_period_years: number | null;
  net_exposure: number | null;
  total_invested_capital: number | null;
  alpha_primary: number | null;
  alpha_secondary: number | null;
}

const parseAvatarList = (avatars?: string | null): ParsedUser[] => {
  if (!avatars) return [];
  return avatars
    .split(",")
    .map((entry) => parseAvatar(entry.trim()))
    .filter((user): user is ParsedUser => user !== null);
};

const rowKey = (row: PnlByNewCompaniesCompanyRow, index: number): string =>
  row.company_name ?? `row-${index}`;

export const transformPnlByNewCompaniesCompanyViewResponse = (
  data: PnlByNewCompaniesCompanyRow[],
  scopeKey: string
): PnlByNewCompaniesCompanyViewTableRow[] =>
  data.map((row, index) => {
    const key = rowKey(row, index);
    return {
      uniqueId: `${scopeKey}-${key}`,
      company_name: row.company_name ?? "",
      venture_analysts: parseAvatarList(row.venture_analyst_avatars),
      venture_analyst_count: null,
      cumulative_pnl_percent_nav: row.cumulative_pnl_percent_nav ?? null,
      cumulative_pnl: row.cumulative_pnl ?? null,
      moic: row.moic ?? null,
      xirr: row.xirr ?? null,
      holding_period_years: row.holding_period_years ?? null,
      net_exposure: row.net_exposure ?? null,
      total_invested_capital: row.total_invested_capital ?? null,
      alpha_primary: row.alpha_vs_xbi ?? null,
      alpha_secondary: row.alpha_vs_rgushsbt ?? null,
    };
  });

export const buildPnlByNewCompaniesCompanyTotalRow = (
  totals: PnlByNewCompaniesCompanyTotals | null | undefined,
  scopeKey: string
): PnlByNewCompaniesCompanyViewTableRow[] => {
  if (!totals) return [];
  return [
    {
      uniqueId: `${scopeKey}-${TOTAL_ROW_ID}`,
      company_name: "Total",
      venture_analysts: [],
      venture_analyst_count: totals.venture_analyst_count ?? null,
      cumulative_pnl_percent_nav: totals.cumulative_pnl_percent_nav ?? null,
      cumulative_pnl: totals.cumulative_pnl ?? null,
      moic: totals.moic ?? null,
      xirr: totals.xirr ?? null,
      holding_period_years: totals.holding_period_years ?? null,
      net_exposure: totals.net_exposure ?? null,
      total_invested_capital: totals.total_invested_capital ?? null,
      alpha_primary: totals.alpha_vs_xbi ?? null,
      alpha_secondary: totals.alpha_vs_rgushsbt ?? null,
    },
  ];
};
