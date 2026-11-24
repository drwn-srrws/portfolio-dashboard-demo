import type {
  PnlByNewCompaniesAnalystRow,
  PnlByNewCompaniesAnalystResponseTotals,
} from "@/api/types";
import {
  parseAvatar,
  type ParsedUser,
} from "@/modules/dashboard/widgets/PnlBySubteamOptimized/PnlBySubteamTable.utils";

export { formatUserFullName } from "@/modules/dashboard/widgets/PnlBySubteamOptimized/PnlBySubteamTable.utils";
export type { ParsedUser } from "@/modules/dashboard/widgets/PnlBySubteamOptimized/PnlBySubteamTable.utils";

export const PRIMARY_BENCHMARK_ID = "XBI US Equity";
export const SECONDARY_BENCHMARK_ID = "RGUSHSBT Index";

export const TOTAL_ROW_ID = "__total__";

export interface PnlByNewCompaniesAnalystViewTableRow {
  uniqueIds: string[];
  venture_analyst_name: string | null;
  venture_analyst: ParsedUser | null;
  company_name: string | null;
  net_exposure: number | null;
  cumulative_pnl_percent_nav: number | null;
  cumulative_pnl: number | null;
  alpha_primary: number | null;
  alpha_secondary: number | null;
}

const analystKey = (row: PnlByNewCompaniesAnalystRow, index: number): string =>
  row.venture_analyst_avatar ?? row.venture_analyst ?? `row-${index}`;

export const transformPnlByNewCompaniesAnalystViewResponse = (
  analystRows: PnlByNewCompaniesAnalystRow[],
  companyRows: PnlByNewCompaniesAnalystRow[],
  scopeKey: string
): PnlByNewCompaniesAnalystViewTableRow[] => {
  const result: PnlByNewCompaniesAnalystViewTableRow[] = [];

  analystRows.forEach((row, index) => {
    const key = analystKey(row, index);

    result.push({
      uniqueIds: [`${scopeKey}-${key}`],
      venture_analyst_name: row.venture_analyst ?? null,
      venture_analyst: parseAvatar(row.venture_analyst_avatar),
      company_name: null,
      net_exposure: row.net_exposure ?? null,
      cumulative_pnl_percent_nav: row.cumulative_pnl_percent_nav ?? null,
      cumulative_pnl: row.cumulative_pnl ?? null,
      alpha_primary: row.alpha_vs_xbi ?? null,
      alpha_secondary: row.alpha_vs_rgushsbt ?? null,
    });

    const children = companyRows.filter(
      (c) =>
        (c.venture_analyst_avatar ?? c.venture_analyst) ===
        (row.venture_analyst_avatar ?? row.venture_analyst)
    );

    children.forEach((child, childIndex) => {
      result.push({
        uniqueIds: [
          `${scopeKey}-${key}`,
          child.company_name ?? `unknown-${index}-${childIndex}`,
        ],
        venture_analyst_name: child.venture_analyst ?? null,
        venture_analyst: parseAvatar(child.venture_analyst_avatar),
        company_name: child.company_name ?? null,
        net_exposure: child.net_exposure ?? null,
        cumulative_pnl_percent_nav: child.cumulative_pnl_percent_nav ?? null,
        cumulative_pnl: child.cumulative_pnl ?? null,
        alpha_primary: child.alpha_vs_xbi ?? null,
        alpha_secondary: child.alpha_vs_rgushsbt ?? null,
      });
    });
  });

  return result;
};

export const buildPnlByNewCompaniesAnalystTotalRow = (
  totals: PnlByNewCompaniesAnalystResponseTotals | undefined,
  scopeKey: string
): PnlByNewCompaniesAnalystViewTableRow[] => {
  if (!totals) return [];
  return [
    {
      uniqueIds: [`${scopeKey}-${TOTAL_ROW_ID}`],
      venture_analyst_name: "Total",
      venture_analyst: null,
      company_name: null,
      net_exposure: totals.net_exposure ?? null,
      cumulative_pnl_percent_nav: totals.cumulative_pnl_percent_nav ?? null,
      cumulative_pnl: totals.cumulative_pnl ?? null,
      alpha_primary: totals.alpha_vs_xbi ?? null,
      alpha_secondary: totals.alpha_vs_rgushsbt ?? null,
    },
  ];
};
