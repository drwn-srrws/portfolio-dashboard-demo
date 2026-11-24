export const calculateScalingCoefficient = (
  data: Record<string, unknown>[]
): number => {
  const maxAbsoluteValue = data.reduce(
    (max: number, item: Record<string, unknown>) => {
      const absLoss = Math.abs((item.avg_loss_pnl_pct_nav as number) ?? 0);
      const absWin = Math.abs((item.avg_win_pnl_pct_nav as number) ?? 0);
      return Math.max(max, absLoss, absWin);
    },
    0
  );

  if (maxAbsoluteValue === 0) {
    return 1;
  }

  const coefficient = 100 / maxAbsoluteValue;

  return coefficient;
};

export const flattenBattingAndSluggingHierarchy = <
  T extends Record<string, unknown>,
>({
  dataLevels,
  groupingFields,
}: {
  dataLevels: T[][];
  groupingFields: string[];
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

      const fieldHeader = item[currentGroupingField]
        ? String(item[currentGroupingField])
        : undefined;

      const category =
        levelIndex > 0 ? String(item[groupingFields[0]]) : undefined;

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

    const fieldHeader = String(item[groupingFields[0]]);
    const category = String(item[groupingFields[0]]);

    const topLevelItem = {
      ...item,
      uniqueIds: topLevelUniqueIds,
      fieldHeader,
      category,
    } as T & { uniqueIds: string[]; fieldHeader?: string; category?: string };

    const children = buildHierarchy(1, item, topLevelUniqueIds);

    return [...acc, topLevelItem, ...children];
  }, []);

  return flatList;
};
