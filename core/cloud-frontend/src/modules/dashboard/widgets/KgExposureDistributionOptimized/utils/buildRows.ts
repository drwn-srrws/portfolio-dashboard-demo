import { KgExposureResponse } from "@api/types/index";

export interface NestedRow extends Record<string, unknown> {
  uniqueIds: string[];
}

export const buildNestedRows = (response?: KgExposureResponse): NestedRow[] => {
  if (!response) return [];
  const groupByFields = response.metadata?.group_by ?? [];

  return response.data.map((dataRow) => {
    const row = dataRow as unknown as Record<string, unknown>;
    const uniqueIds = groupByFields.map((field) => String(row[field] ?? ""));
    return { ...row, uniqueIds };
  });
};

export const getMetricNamesFromResponse = (
  response?: KgExposureResponse
): string[] => {
  const displayColumns = response?.metadata?.display_columns ?? [];
  const groupByColumns = response?.metadata?.group_by ?? [];
  return displayColumns.filter((col) => !groupByColumns.includes(col));
};

export const getGroupingFieldsFromResponse = (
  response?: KgExposureResponse
): string[] => response?.metadata?.group_by ?? [];
