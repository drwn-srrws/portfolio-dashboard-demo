import { Selectable } from "@/typings/Selectable";

export function omitBy(
  obj: Record<string, Selectable["value"][]>,
  filterFn: (item: Selectable["value"][]) => boolean
): Record<string, Selectable["value"][]> {
  return Object.keys(obj).reduce(
    (result, key) => {
      if (!filterFn(obj[key])) {
        result[key] = obj[key];
      }
      return result;
    },
    {} as Record<string, Selectable["value"][]>
  );
}
