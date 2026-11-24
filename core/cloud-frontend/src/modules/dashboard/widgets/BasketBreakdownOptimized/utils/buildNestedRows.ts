import { BasketBreakdownResponse } from "@api/types/index";

export interface NestedRow extends Record<string, unknown> {
  uniqueIds: string[];
}

export const buildNestedRows = (
  responses: BasketBreakdownResponse[]
): NestedRow[] => {
  const rows: NestedRow[] = [];

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
  responses: BasketBreakdownResponse[]
): string[] => {
  const first = responses[0];
  if (!first) return [];
  const displayColumns = first.metadata?.display_columns ?? [];
  const groupByColumns = first.metadata?.group_by ?? [];
  return displayColumns.filter((col) => !groupByColumns.includes(col));
};

export const getGroupingFieldsFromResponse = (
  responses: BasketBreakdownResponse[]
): string[] => {
  const last = responses[responses.length - 1];
  return last?.metadata?.group_by ?? [];
};
