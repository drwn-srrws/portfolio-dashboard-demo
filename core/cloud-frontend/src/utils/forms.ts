import { Path, path } from "ramda";

import { Selectable } from "@typings/Selectable";

import { byTruthy } from "./lists";

export const SelectAll = { value: "all", label: "All" };

const sortOptionsAlphabetically = (a: Selectable, b: Selectable) => {
  if (a.label < b.label) return -1;
  if (a.label > b.label) return 1;
  return 0;
};

export const createDropdownOptions = <TData = unknown>(
  data: TData[],
  pathToValue: Path,
  pathToLabel: Path,
  includeAllOption = false
): Selectable[] => {
  const getId = path(pathToValue);
  const getLabel = path(pathToLabel);

  const options: Selectable[] = data.map((item) => ({
    value: getId(item) as string | number,
    label: getLabel(item) as string,
  }));

  const uniqueOptions = options
    .filter(
      (option, index, self) =>
        index === self.findIndex((t) => t.value === option.value)
    )
    .filter((o) => byTruthy(o.value) && byTruthy(o.value))
    .sort(sortOptionsAlphabetically);

  const result = includeAllOption
    ? [SelectAll, ...uniqueOptions]
    : uniqueOptions;

  return result;
};
