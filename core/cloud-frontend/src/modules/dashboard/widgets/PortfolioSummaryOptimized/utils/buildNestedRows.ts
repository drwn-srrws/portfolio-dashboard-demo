import { PortfolioSummaryResponse } from "@api/types/index";

export interface PortfolioSummaryRow extends Record<string, unknown> {
  uniqueIds: string[];
}

export const buildNestedRows = (
  responses: PortfolioSummaryResponse[]
): PortfolioSummaryRow[] => {
  const rows: PortfolioSummaryRow[] = [];

  for (const result of responses) {
    const groupByFields = result.metadata?.group_by ?? [];

    for (const dataRow of result.data) {
      const row = dataRow as unknown as Record<string, unknown>;
      const uniqueIds = groupByFields.map((field) => String(row[field] ?? ""));
      rows.push({ ...row, uniqueIds });
    }
  }

  return rows;
};

export const getMetricNamesFromResponse = (
  responses: PortfolioSummaryResponse[]
): string[] => {
  const first = responses[0];
  if (!first) return [];
  const displayColumns = first.metadata?.display_columns ?? [];
  const groupByColumns = first.metadata?.group_by ?? [];
  return displayColumns.filter((col) => !groupByColumns.includes(col));
};

export const getSelectableMetricNamesFromResponse = (
  responses: PortfolioSummaryResponse[]
): string[] => {
  const first = responses[0];
  if (!first) return [];

  const groupByColumns = new Set(first.metadata?.group_by ?? []);

  const selectable = first.metadata?.selectable_display_columns ?? [];
  const displayColumns = first.metadata?.display_columns ?? [];
  const hiddenColumns = first.metadata?.hidden_display_columns ?? [];

  const base =
    selectable.length > 0 ? selectable : [...displayColumns, ...hiddenColumns];

  const seen = new Set<string>();
  const out: string[] = [];
  for (const col of base) {
    if (!col || groupByColumns.has(col) || seen.has(col)) continue;
    seen.add(col);
    out.push(col);
  }

  return out;
};

export const getGroupingFieldsFromResponse = (
  responses: PortfolioSummaryResponse[]
): string[] => {
  const last = responses[responses.length - 1];
  return last?.metadata?.group_by ?? [];
};
