import { z } from "zod";
import { CoverageType } from "@api/types/index";
import { capitalize } from "@/utils/strings";

const selectOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const coverageFormSchema = z.object({
  company: z
    .union([selectOptionSchema, z.null()])
    .refine((data) => data !== null, {
      message: "Company is required",
    }),
  analyst: z
    .union([selectOptionSchema, z.null()])
    .refine((data) => data !== null, {
      message: "Analyst is required",
    }),
  coverageType: z.union([
    z.object({
      value: z.nativeEnum(CoverageType),
      label: z.string(),
    }),
    z.null().refine((data) => data !== null, {
      message: "Coverage type is required",
    }),
  ]),
  effectiveStartDate: z.date(),
  effectiveEndDate: z.date().optional().nullable(),
});

export type ICoverageValues = {
  company: z.infer<typeof selectOptionSchema> | null;
  analyst: z.infer<typeof selectOptionSchema> | null;
  coverageType: {
    value: CoverageType;
    label: string;
  };
  effectiveStartDate: Date;
  effectiveEndDate?: Date | null;
};

export const defaultCoverageValues: ICoverageValues = {
  company: null,
  analyst: null,
  coverageType: {
    value: CoverageType.primary,
    label: capitalize(CoverageType.primary),
  },
  effectiveStartDate: new Date(),
  effectiveEndDate: null,
};
