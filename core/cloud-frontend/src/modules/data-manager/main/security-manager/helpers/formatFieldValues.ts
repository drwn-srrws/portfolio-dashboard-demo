import { Selectable } from "@/typings/Selectable";
import { toPairs, filter, reduce, pipe } from "ramda";
import { z } from "zod";

const isNonEmptyArray = (value: unknown): value is unknown[] =>
  Array.isArray(value) && value.length > 0;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim() !== "";

const extractSelectableValue = (value: Selectable) => value.value;

const extractSelectableValues = (values: Selectable[]) =>
  values.map(extractSelectableValue).filter(Boolean);

export const formatSingleSelectFields = pipe(
  toPairs,
  reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: (value as Selectable)
        ? extractSelectableValue(value as Selectable)
        : null,
    }),
    {}
  )
);

export const formatMultiSelectFields = pipe(
  toPairs,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filter(([_, value]) => isNonEmptyArray(value)),
  reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: extractSelectableValues(value as Selectable[]),
    }),
    {}
  )
);

export const formatTextFieldValues = pipe(
  toPairs,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filter(([_, value]) => isNonEmptyString(value)),
  reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value,
    }),
    {}
  )
);

export const auditSchema = z.object({
  value: z.any(),
  override: z.record(z.any()),
});

export const formatAuditFieldValues = (data: Record<string, unknown>) => {
  const result: Record<string, string | undefined> = {};

  for (const [key, value] of Object.entries(data)) {
    const parsed = auditSchema.safeParse(value);

    if (parsed.error) {
      continue;
    }

    result[key] = parsed.data.value;
  }

  return result;
};
