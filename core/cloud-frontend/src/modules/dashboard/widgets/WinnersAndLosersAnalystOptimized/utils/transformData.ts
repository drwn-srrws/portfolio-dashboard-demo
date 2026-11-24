export const transformToRowsData = (
  data: Array<Record<string, unknown>>
): Array<{ id: string } & Record<string, unknown>> => {
  if (!data || data.length === 0) {
    return [];
  }

  return data.map((row, index) => ({
    ...row,
    id: `row-${index}`,
  }));
};
