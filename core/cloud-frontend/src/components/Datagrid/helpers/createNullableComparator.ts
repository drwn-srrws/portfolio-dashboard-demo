export const createNullableComparator = <T>(
  compareFn: (a: T, b: T, isDescending: boolean) => number
): ((
  a: T | null | undefined,
  b: T | null | undefined,
  _nodeA: unknown,
  _nodeB: unknown,
  isDescending: boolean
) => number) => {
  return (
    a: T | null | undefined,
    b: T | null | undefined,
    _nodeA,
    _nodeB,
    isDescending
  ) => {
    if (a == null && b == null) return 0;

    if (isDescending) {
      if (a == null) return -1;
      if (b == null) return 1;
    } else {
      if (a == null) return 1;
      if (b == null) return -1;
    }

    return compareFn(a, b, isDescending);
  };
};
