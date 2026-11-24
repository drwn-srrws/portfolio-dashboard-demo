import { z } from "zod";

import { FormSection } from "@/api/types/formSection";
import { FormField, FormFieldType } from "@/api/types";
import { Selectable } from "@/typings/Selectable";
import { AuditResponse } from "../components/FormAuditField";

type ConditionalRule = {
  fieldName: string;
  fieldType: FormFieldType;
  trigger: { name: string; allowed: string[] };
};

const REQUIRED_MESSAGE = "Required";

const isFieldValueEmpty = (value: unknown, type: FormFieldType): boolean => {
  if (value === null || value === undefined) return true;
  switch (type) {
    case "string":
      return typeof value !== "string" || value.trim() === "";
    case "select": {
      const sel = value as { value?: string | null } | null;
      return !sel?.value;
    }
    case "multi-select":
      return !Array.isArray(value) || value.length === 0;
    case "audit": {
      const audit = value as {
        value?: string | null;
        fallback?: string | null;
      } | null;
      return !audit?.value && !audit?.fallback;
    }
    default:
      return false;
  }
};

const buildFieldSchema = (field: FormField): z.ZodType => {
  switch (field.type) {
    case "string": {
      const base = z.string();
      return field.required
        ? base.min(1, REQUIRED_MESSAGE)
        : base.nullable().optional();
    }
    case "select": {
      const base = z
        .object({ value: z.string(), label: z.string() })
        .nullable();
      return field.required
        ? base.refine((v) => !!v?.value, { message: REQUIRED_MESSAGE })
        : base.optional();
    }
    case "multi-select": {
      const base = z.array(z.object({ value: z.string(), label: z.string() }));
      return field.required
        ? base.min(1, REQUIRED_MESSAGE)
        : base.nullable().optional();
    }
    case "audit": {
      const base = z.any();
      return field.required
        ? base.refine((v) => !isFieldValueEmpty(v, "audit"), {
            message: REQUIRED_MESSAGE,
          })
        : base.optional();
    }
    default:
      return z.any();
  }
};

const collectConditionalRules = (
  sections: FormSection[]
): ConditionalRule[] => {
  const rules: ConditionalRule[] = [];
  for (const section of sections) {
    for (const field of section.fields) {
      if (!field.required_when) continue;
      for (const [triggerName, allowed] of Object.entries(
        field.required_when
      )) {
        if (Array.isArray(allowed) && allowed.length > 0) {
          rules.push({
            fieldName: field.name,
            fieldType: field.type,
            trigger: { name: triggerName, allowed },
          });
        }
      }
    }
  }
  return rules;
};

const resolveTriggerValue = (raw: unknown): string | null => {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === "string") return raw;
  if (typeof raw === "object" && raw !== null && "value" in raw) {
    const v = (raw as { value?: unknown }).value;
    return typeof v === "string" ? v : null;
  }
  return null;
};

export const generateSchemaFromConfig = (fields: FormSection[]) => {
  const shape = fields.reduce(
    (acc: Record<string, z.ZodType>, section: FormSection) => {
      section.fields.forEach((field: FormField) => {
        acc[field.name] = buildFieldSchema(field);
      });
      return acc;
    },
    {}
  );

  return z.object(shape);
};

export const convertHyphenToUnderscore = (str: string): string => {
  if (str.endsWith("_id")) {
    return str.replace(/_id$/, "");
  }
  return str;
};

export const addConfigFieldsToDefaultValues = <
  T extends { id: number; name: string },
>(
  config: FormSection[],
  defaultValues?: T
) => {
  const newDefaultValues = config.map((section) =>
    section.fields.map((field) => {
      const fieldName = convertHyphenToUnderscore(field.name);
      let fieldValue: unknown = defaultValues?.[fieldName as keyof T] || null;

      if (field.type === "string") {
        fieldValue = fieldValue || "";
      }

      if (field.type == "audit") {
        const audit = fieldValue as AuditResponse;
        fieldValue = {
          ...audit,
          fallback: audit.value,
          value: audit.override?.value ?? null,
        };
      }

      if (field.type === "multi-select") {
        if (
          !fieldValue ||
          !Array.isArray(fieldValue) ||
          fieldValue.length === 0
        ) {
          fieldValue = [];
        }

        if (fieldValue && Array.isArray(fieldValue)) {
          fieldValue = fieldValue.map((value) => ({
            value: value,
            label: value,
          }));
        }
      }

      if (field.type === "select") {
        if (
          fieldValue &&
          typeof fieldValue === "object" &&
          "id" in fieldValue &&
          "name" in fieldValue
        ) {
          const typedValue = fieldValue as { id: number; name: string };
          fieldValue = {
            value: typedValue.id.toString(),
            label: typedValue.name,
          };
        }

        if (fieldValue && typeof fieldValue === "string") {
          fieldValue = {
            value: fieldValue,
            label: fieldValue,
          };
        }

        if (!fieldValue) {
          fieldValue = null;
        }
      }

      return {
        [field.name]: fieldValue,
      };
    })
  );

  const mergedObject = newDefaultValues.flat().reduce((acc, obj) => {
    return { ...acc, ...obj };
  }, {});

  return mergedObject;
};

export const addConfigFieldsToSchema = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  config: FormSection[]
): z.ZodType<
  z.infer<typeof schema> & {
    [key: string]: string | Selectable | Selectable[] | null;
  }
> => {
  const configSchema = generateSchemaFromConfig(config);
  const merged = schema.merge(configSchema) as z.ZodObject<
    T & Record<string, z.ZodType>
  >;

  const conditionalRules = collectConditionalRules(config);
  if (conditionalRules.length === 0) {
    return merged as unknown as z.ZodType<
      z.infer<typeof schema> & {
        [key: string]: string | Selectable | Selectable[] | null;
      }
    >;
  }

  return merged.superRefine((data, ctx) => {
    const record = data as Record<string, unknown>;
    for (const rule of conditionalRules) {
      const triggerValue = resolveTriggerValue(record[rule.trigger.name]);
      if (!triggerValue || !rule.trigger.allowed.includes(triggerValue)) {
        continue;
      }
      if (isFieldValueEmpty(record[rule.fieldName], rule.fieldType)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [rule.fieldName],
          message: REQUIRED_MESSAGE,
        });
      }
    }
  }) as unknown as z.ZodType<
    z.infer<typeof schema> & {
      [key: string]: string | Selectable | Selectable[] | null;
    }
  >;
};
