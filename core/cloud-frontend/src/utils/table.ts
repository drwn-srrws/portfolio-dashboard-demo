import { ascend, descend, groupBy, map, pipe, sort, toPairs } from "ramda";

export interface GetRating {
  rating_date: string;
  instrument_id: number;
  instrument_ticker: string;
  subsector: string;
  analyst_id: number;
  analyst_name: string;
  rating_name: string;
  rating_value: number;
  comment?: string | null;
}

import { capitalize } from "./strings";
import { Selectable } from "@/typings/Selectable";

export interface TableEntry {
  [key: string]: unknown;
}

export type NestedTableEntry<T extends Record<string, unknown>> = T & {
  uniqueIds: string[];
  fieldHeader?: string;
  category?: string | number;
};

interface FormatNestedTableDataProps<T extends Record<string, unknown>> {
  topLevelEntries: T[];
  nestedEntries: T[];
  primaryGroupingField: Selectable["value"];
  secondaryGroupingField: Selectable["value"];
  sortOrder?: "asc" | "desc";
}

interface FormatNonNestedTableDataProps {
  entries: TableEntry[];
  primaryGroupingField: Selectable["value"];
}
export const flattenThreeLevelHierarchy = <T extends Record<string, unknown>>({
  top,
  mid,
  last,
  topGroupingField: topGroupingFieldProps,
  midGroupingField: midGroupingFieldProps,
  lastGroupingField: lastGroupingFieldProps,
  sortOrder,
}: {
  top: T[];
  mid: T[];
  last: T[];
  topGroupingField: Selectable["value"];
  midGroupingField: Selectable["value"];
  lastGroupingField: Selectable["value"];
  sortOrder?: "asc" | "desc";
}): Array<T & { uniqueIds: string[] }> => {
  const topGroupingField = String(topGroupingFieldProps);
  const midGroupingField = String(midGroupingFieldProps);
  const lastGroupingField = String(lastGroupingFieldProps);

  const flatList = top.reduce<Array<T & { uniqueIds: string[] }>>(
    (acc, item) => {
      const midData = mid
        .filter(
          (midItem) => midItem[topGroupingField] === item[topGroupingField]
        )
        .map((midItem) => ({
          ...midItem,
          uniqueIds: [
            String(item[topGroupingField]),
            String(midItem[midGroupingField]),
          ],
        })) as Array<T & { uniqueIds: string[] }>;

      const lastData = last
        .filter((lastItem) =>
          midData.some(
            (midItem) =>
              midItem[midGroupingField as keyof typeof midItem] ===
                lastItem[midGroupingField as keyof typeof lastItem] &&
              midItem[topGroupingField as keyof typeof midItem] ===
                lastItem[topGroupingField as keyof typeof lastItem]
          )
        )
        .map((lastItem) => ({
          ...lastItem,
          uniqueIds: [
            String(item[topGroupingField]),
            String(lastItem[midGroupingField]),
            String(lastItem[lastGroupingField]),
          ],
        })) as Array<T & { uniqueIds: string[] }>;

      const current = item.key
        ? (item as T & { uniqueIds: string[] })
        : ({ ...item, uniqueIds: [String(item[topGroupingField])] } as T & {
            uniqueIds: string[];
          });
      return [...acc, current, ...midData, ...lastData];
    },
    []
  );

  const sortedList = sortOrder
    ? (sort(
        sortOrder === "asc"
          ? ascend(
              (item: T & { uniqueIds: string[] }) =>
                (item.cumulative_pnl as number) || 0
            )
          : descend(
              (item: T & { uniqueIds: string[] }) =>
                (item.cumulative_pnl as number) || 0
            )
      )(flatList) as Array<T & { uniqueIds: string[] }>)
    : flatList;

  return sortedList;
};

export const flattenDynamicHierarchy = <T extends Record<string, unknown>>({
  dataLevels,
  groupingFields,
  sortOrder,
}: {
  dataLevels: T[][];
  groupingFields: string[];
  sortOrder?: "asc" | "desc";
}): Array<
  T & { uniqueIds: string[]; fieldHeader?: string; category?: string }
> => {
  if (dataLevels.length === 0 || groupingFields.length === 0) {
    return [];
  }

  const topLevel = dataLevels[0] || [];

  const buildHierarchy = (
    levelIndex: number,
    parentItem: T,
    parentUniqueIds: string[]
  ): Array<
    T & { uniqueIds: string[]; fieldHeader?: string; category?: string }
  > => {
    if (
      levelIndex >= dataLevels.length ||
      levelIndex >= groupingFields.length
    ) {
      return [];
    }

    const currentLevelData = dataLevels[levelIndex] || [];
    const currentGroupingField = groupingFields[levelIndex];
    const previousGroupingFields = groupingFields.slice(0, levelIndex);

    const filteredData = currentLevelData.filter((item) => {
      return previousGroupingFields.every(
        (field) => item[field] === parentItem[field]
      );
    });

    const result: Array<
      T & { uniqueIds: string[]; fieldHeader?: string; category?: string }
    > = [];

    filteredData.forEach((item) => {
      const currentUniqueIds = [
        ...parentUniqueIds,
        String(item[currentGroupingField]),
      ];

      const fieldHeader =
        levelIndex === 1 && groupingFields.length === 2
          ? item[currentGroupingField]
            ? String(item[currentGroupingField])
            : String(item[groupingFields[0]])
          : undefined;

      const category =
        levelIndex === 1 && groupingFields.length === 2
          ? String(item[groupingFields[0]])
          : undefined;

      const itemWithIds = {
        ...item,
        uniqueIds: currentUniqueIds,
        ...(fieldHeader && { fieldHeader }),
        ...(category && { category }),
      } as T & { uniqueIds: string[]; fieldHeader?: string; category?: string };

      result.push(itemWithIds);

      const children = buildHierarchy(levelIndex + 1, item, currentUniqueIds);
      result.push(...children);
    });

    return result;
  };

  const flatList = topLevel.reduce<
    Array<T & { uniqueIds: string[]; fieldHeader?: string; category?: string }>
  >((acc, item) => {
    const topLevelUniqueIds = [String(item[groupingFields[0]])];

    const fieldHeader =
      groupingFields.length === 2 ? String(item[groupingFields[0]]) : undefined;

    const category =
      groupingFields.length === 2 ? String(item[groupingFields[0]]) : undefined;

    const topLevelItem = {
      ...item,
      uniqueIds: topLevelUniqueIds,
      ...(fieldHeader && { fieldHeader }),
      ...(category && { category }),
    } as T & { uniqueIds: string[]; fieldHeader?: string; category?: string };

    const children = buildHierarchy(1, item, topLevelUniqueIds);

    return [...acc, topLevelItem, ...children];
  }, []);

  const sortedList = sortOrder
    ? (sort(
        sortOrder === "asc"
          ? ascend(
              (item: T & { uniqueIds: string[] }) =>
                (item.cumulative_pnl_percent_nav as number) ||
                (item.cumulative_pnl as number) ||
                0
            )
          : descend(
              (item: T & { uniqueIds: string[] }) =>
                (item.cumulative_pnl_percent_nav as number) ||
                (item.cumulative_pnl as number) ||
                0
            )
      )(flatList) as Array<
        T & { uniqueIds: string[]; fieldHeader?: string; category?: string }
      >)
    : flatList;

  return sortedList;
};

export const flattenFourLevelHierarchy = <T extends Record<string, unknown>>({
  top,
  second,
  third,
  fourth,
  topGroupingField: topGroupingFieldProps,
  secondGroupingField: secondGroupingFieldProps,
  thirdGroupingField: thirdGroupingFieldProps,
  fourthGroupingField: fourthGroupingFieldProps,
  sortOrder,
}: {
  top: T[];
  second: T[];
  third: T[];
  fourth: T[];
  topGroupingField: Selectable["value"];
  secondGroupingField: Selectable["value"];
  thirdGroupingField: Selectable["value"];
  fourthGroupingField: Selectable["value"];
  sortOrder?: "asc" | "desc";
}): Array<T & { uniqueIds: string[] }> => {
  const topGroupingField = String(topGroupingFieldProps);
  const secondGroupingField = String(secondGroupingFieldProps);
  const thirdGroupingField = String(thirdGroupingFieldProps);
  const fourthGroupingField = String(fourthGroupingFieldProps);

  const flatList = top.reduce<Array<T & { uniqueIds: string[] }>>(
    (acc, item) => {
      const secondData = second
        .filter(
          (secondItem) =>
            secondItem[topGroupingField] === item[topGroupingField]
        )
        .map((secondItem) => ({
          ...secondItem,
          uniqueIds: [
            String(item[topGroupingField]),
            String(secondItem[secondGroupingField]),
          ],
        })) as Array<T & { uniqueIds: string[] }>;

      const thirdData = third
        .filter((thirdItem) =>
          secondData.some(
            (secondItem) =>
              secondItem[secondGroupingField as keyof typeof secondItem] ===
                thirdItem[secondGroupingField as keyof typeof thirdItem] &&
              secondItem[topGroupingField as keyof typeof secondItem] ===
                thirdItem[topGroupingField as keyof typeof thirdItem]
          )
        )
        .map((thirdItem) => ({
          ...thirdItem,
          uniqueIds: [
            String(item[topGroupingField]),
            String(thirdItem[secondGroupingField]),
            String(thirdItem[thirdGroupingField]),
          ],
        })) as Array<T & { uniqueIds: string[] }>;

      const fourthData = fourth
        .filter((fourthItem) =>
          thirdData.some(
            (thirdItem) =>
              thirdItem[thirdGroupingField as keyof typeof thirdItem] ===
                fourthItem[thirdGroupingField as keyof typeof fourthItem] &&
              thirdItem[secondGroupingField as keyof typeof thirdItem] ===
                fourthItem[secondGroupingField as keyof typeof fourthItem] &&
              thirdItem[topGroupingField as keyof typeof thirdItem] ===
                fourthItem[topGroupingField as keyof typeof fourthItem]
          )
        )
        .map((fourthItem) => ({
          ...fourthItem,
          uniqueIds: [
            String(item[topGroupingField]),
            String(fourthItem[secondGroupingField]),
            String(fourthItem[thirdGroupingField]),
            String(fourthItem[fourthGroupingField]),
          ],
        })) as Array<T & { uniqueIds: string[] }>;

      const current = item.key
        ? (item as T & { uniqueIds: string[] })
        : ({ ...item, uniqueIds: [String(item[topGroupingField])] } as T & {
            uniqueIds: string[];
          });

      return [...acc, current, ...secondData, ...thirdData, ...fourthData];
    },
    []
  );

  const sortedList = sortOrder
    ? (sort(
        sortOrder === "asc"
          ? ascend(
              (item: T & { uniqueIds: string[] }) =>
                (item.cumulative_pnl_percent_nav as number) ||
                (item.cumulative_pnl as number) ||
                0
            )
          : descend(
              (item: T & { uniqueIds: string[] }) =>
                (item.cumulative_pnl_percent_nav as number) ||
                (item.cumulative_pnl as number) ||
                0
            )
      )(flatList) as Array<T & { uniqueIds: string[] }>)
    : flatList;

  return sortedList;
};

export const formatDataToNestedTableData = <T extends Record<string, unknown>>({
  topLevelEntries,
  nestedEntries,
  primaryGroupingField: primaryGroupingFieldProps,
  secondaryGroupingField: secondaryGroupingFieldProps,
  sortOrder,
}: FormatNestedTableDataProps<T>): NestedTableEntry<T>[] => {
  const primaryGroupingField = String(primaryGroupingFieldProps);
  const secondaryGroupingField = String(secondaryGroupingFieldProps);

  const assetClasses = new Set(
    topLevelEntries.map((entry) => entry[primaryGroupingField])
  );

  const filteredNestedData = nestedEntries.filter((entry) =>
    assetClasses.has(entry[primaryGroupingField])
  );

  const combinedData = [...topLevelEntries, ...filteredNestedData];

  const groupedData = groupBy(
    (entry) =>
      JSON.stringify({
        primary: entry[primaryGroupingField],
        secondary: entry[secondaryGroupingField] || "",
      }),
    combinedData
  );

  return pipe(
    toPairs,
    map(([key, items]: [string, T[]]) => {
      const { primary: groupedCategory, secondary: groupedValue } =
        JSON.parse(key);

      const capitalizedGroupedCategory = capitalize(
        groupedCategory?.toString()
      );
      const capitalizedGroupedValue = groupedValue
        ? capitalize(groupedValue)
        : "";

      const fieldHeader = groupedValue ? groupedValue : groupedCategory;

      const uniqueIds = groupedValue
        ? [capitalizedGroupedCategory, capitalizedGroupedValue]
        : [capitalizedGroupedCategory];

      return {
        ...items[0],
        uniqueIds,
        fieldHeader: fieldHeader,
        category: groupedCategory,
      } as NestedTableEntry<T>;
    }),
    sortOrder
      ? sort(
          sortOrder === "asc"
            ? ascend((item: NestedTableEntry<T>) => Number(item.cumulative_pnl))
            : descend((item: NestedTableEntry<T>) =>
                Number(item.cumulative_pnl)
              )
        )
      : (x) => x
  )(groupedData);
};

export const formatDataToNonNestedTableData = ({
  entries,
  primaryGroupingField: primaryGroupingFieldProps,
}: FormatNonNestedTableDataProps) => {
  const primaryGroupingField = String(primaryGroupingFieldProps);

  const groupedData = groupBy(
    (entry) => JSON.stringify({ primary: entry[primaryGroupingField] }),
    entries
  );

  return pipe(
    toPairs,
    map(([key, items]: [string, Array<Record<string, unknown>>]) => {
      const { primary: groupedCategory } = JSON.parse(key);

      const capitalizedGroupedCategory = capitalize(groupedCategory);

      return {
        ...items[0],
        uniqueIds: [capitalizedGroupedCategory],
        category: groupedCategory,
      };
    })
  )(groupedData);
};

export const formatRatingData = (
  data: GetRating[],
  groupBy: Selectable["value"]
): { parents: TableEntry[]; children: TableEntry[] } => {
  const fieldMap: { [key: string]: keyof GetRating } = {
    primary_analyst: "analyst_name",
    company_subsector: "subsector",
  };

  const actualGroupBy = fieldMap[String(groupBy)] || groupBy;

  const parentData: { [key: string]: unknown } = {};

  const seenChildren = new Set<string>();
  const childrenData = data
    .map((item) => {
      const groupKey =
        item[String(actualGroupBy) as keyof GetRating] || "Untitled";
      const uniqueKey = `${groupKey}_${item.analyst_id}_${item.instrument_id}`;
      const colField =
        groupBy === "instrument_ticker"
          ? groupKey + item.analyst_name
          : groupKey;

      if (!parentData[groupKey as string]) {
        parentData[groupKey as string] = {
          category: groupKey,
          colField,
          instrument_ticker: item.instrument_ticker,
          primary_analyst: item.analyst_name,
          company_subsector: item.subsector || "Untitled",
          comment: item.comment,
          _analyst_id: item.analyst_id,
          _instrument_id: item.instrument_id,
        };
      }

      if (!seenChildren.has(uniqueKey)) {
        seenChildren.add(uniqueKey);
        return {
          category: groupKey,
          colField,
          instrument_ticker: item.instrument_ticker,
          primary_analyst: item.analyst_name,
          company_subsector: item.subsector || "Untitled",
          comment: item.comment,
          _analyst_id: item.analyst_id,
          _instrument_id: item.instrument_id,
        };
      }

      return null;
    })
    .filter((child) => child !== null);

  const sortedParents = Object.values(parentData)
    .map((parent) => parent as TableEntry)
    .sort((a, b) => (a.category as string).localeCompare(b.category as string));

  return {
    parents: sortedParents || [],
    children: childrenData || [],
  };
};
