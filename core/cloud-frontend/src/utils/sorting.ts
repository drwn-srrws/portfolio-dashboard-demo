import { Path, path } from "ramda";

export const sortByPropAtPath =
  <T, TProp>(pathToProp: Path, sortingFunc: (a: TProp, b: TProp) => number) =>
  (items: T[]) => {
    return items.sort((a, b) => {
      const aProp = path(pathToProp, a) as TProp;
      const bProp = path(pathToProp, b) as TProp;

      return sortingFunc(aProp, bProp);
    });
  };

const handleNullsInArraySorts = <T>(a: T | null, b: T | null) => {
  if ((a as T[]).length === 0 && (b as T[]).length === 0) return 0;
  if ((a as T[]).length > 0 && (b as T[]).length === 0) return 1;
  if ((a as T[]).length === 0 && (b as T[]).length > 0) return -1;
};

export const handleNullsInCustomSorts = <T>(a: T | null, b: T | null) => {
  if (Array.isArray(a) || Array.isArray(b))
    return handleNullsInArraySorts(a, b);
  else if (!a && !b) return 0;
  else if (!a) return 1;
  else if (!b) return -1;
};

export const sortDatesByStart = (a?: Date, b?: Date) => {
  const handleNulls = handleNullsInCustomSorts(a, b);
  if (handleNulls) return handleNulls;

  return a!.getTime() - b!.getTime();
};

export const sortStringDates = (a?: string | null, b?: string | null) => {
  return sortDatesByStart(new Date(a!), new Date(b!));
};
