import { FundBreakdownResponse } from "@api/types/index";

export interface FundBreakdownRow extends Record<string, unknown> {
  uniqueIds: string[];
}

const TREE_PATH_FIELDS = ["name", "grouped_metric_value"];

export const buildNestedRows = (
  responses: FundBreakdownResponse[]
): FundBreakdownRow[] => {
  const rows: FundBreakdownRow[] = [];

  for (const result of responses) {
    for (const dataRow of result.data) {
      const row = dataRow as unknown as Record<string, unknown>;
      const uniqueIds = TREE_PATH_FIELDS.map((field) => row[field])
        .filter((v): v is string => v != null && v !== "")
        .map(String);

      if (uniqueIds.length > 0) {
        rows.push({ ...row, uniqueIds });
      }
    }
  }

  return rows;
};

export const getMetricNamesFromResponse = (
  responses: FundBreakdownResponse[]
): string[] => {
  const first = responses[0];
  if (!first) return [];
  const displayColumns = first.metadata?.display_columns ?? [];
  return displayColumns.filter((col) => !TREE_PATH_FIELDS.includes(col));
};
