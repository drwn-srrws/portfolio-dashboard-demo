import { TopWinnersAndLosersAnalystResponse } from "@api/types/index";

export interface NestedRow extends Record<string, unknown> {
  uniqueIds: string[];
}

type AnyRow = Record<string, unknown>;

const toIdPart = (value: unknown): string => {
  if (value == null) return "";
  return String(value);
};

const joinGroupId = (parts: string[]): string => parts.join("|");

const uniq = (items: string[]): string[] => {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item)) return false;
    seen.add(item);
    return true;
  });
};

const pickColumns = (row: AnyRow, columns: string[]): AnyRow =>
  columns.reduce<AnyRow>((acc, col) => {
    const value = row[col];
    if (value !== undefined) acc[col] = value;
    return acc;
  }, {});

const getTreeGroupByFields = (groupBy: string[]): string[] =>
  groupBy.filter((f) => !f.endsWith("_avatar"));

export const buildNestedRows = (
  responses: TopWinnersAndLosersAnalystResponse[]
): NestedRow[] => {
  const entries = responses.flatMap((result) => {
    const groupByFields = (result.metadata?.group_by ?? []).filter(
      (f) => f.length > 0
    );
    const treeGroupByFields = getTreeGroupByFields(groupByFields);
    const displayColumns = (result.metadata?.display_columns ?? []).filter(
      (c) => c.length > 0
    );
    const columnsForLevel = uniq([...groupByFields, ...displayColumns]);

    return result.data.map((dataRow) => {
      const raw = dataRow as unknown as AnyRow;
      const uniqueIds = treeGroupByFields.map((field) => toIdPart(raw[field]));
      const rowId = joinGroupId(uniqueIds);
      const picked = pickColumns(raw, columnsForLevel);
      const row: NestedRow = { ...picked, uniqueIds };
      return { rowId, row };
    });
  });

  return [
    ...entries
      .reduce((acc, { rowId, row }) => {
        if (!acc.has(rowId)) acc.set(rowId, row);
        return acc;
      }, new Map<string, NestedRow>())
      .values(),
  ];
};

export const getMetricNamesFromResponse = (
  responses: TopWinnersAndLosersAnalystResponse[]
): string[] => {
  const seen = new Set<string>();
  return responses
    .map((r) => ({
      displayColumns: r.metadata?.display_columns ?? [],
      groupByColumns: r.metadata?.group_by ?? [],
    }))
    .flatMap(({ displayColumns, groupByColumns }) =>
      displayColumns.filter(
        (col) =>
          col.length > 0 &&
          !groupByColumns.includes(col) &&
          !col.endsWith("_avatar")
      )
    )
    .filter((col) => {
      if (seen.has(col)) return false;
      seen.add(col);
      return true;
    });
};

export const getGroupingFieldsFromResponse = (
  responses: TopWinnersAndLosersAnalystResponse[]
): string[] => {
  const last = responses[responses.length - 1];
  return getTreeGroupByFields(last?.metadata?.group_by ?? []);
};
