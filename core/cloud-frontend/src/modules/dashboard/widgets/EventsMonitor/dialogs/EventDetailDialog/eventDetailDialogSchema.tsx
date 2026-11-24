import { z } from "zod";
import { CoverageType } from "@api/types/index";
import { capitalize } from "@/utils/strings";

export const eventDetailDialogSchema = z
  .object({
    companyName: z.string().min(1, "Company name is required"),
    name: z.string().min(1, "Analyst name is required").nullable(),
    eventType: z
      .number()
      .min(1, "Event type is required")
      .nullable()
      .optional(),
    eventClassification: z
      .number()
      .min(1, "Event classification is required")
      .nullable()
      .optional(),
    eventImpact: z
      .number()
      .min(1, "Event impact is required")
      .nullable()
      .optional(),
    dateShape: z.enum(["date", "month", "quarter"]),
    date: z.date(),
    rangeWeeks: z
      .union([
        z.literal(0),
        z.literal(1),
        z.literal(2),
        z.literal(3),
        z.literal(4),
      ])
      .optional(),
    description: z.string().optional(),
    workstreamDescription: z.string().optional(),
    hasPassed: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.dateShape === "date" && data.rangeWeeks === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Required",
        path: ["rangeWeeks"],
      });
    }
  });

export type IEventDetailDialogValues = z.infer<typeof eventDetailDialogSchema>;

export const defaultEventDetailDialogValues: IEventDetailDialogValues = {
  companyName: "",
  name: "",
  eventType: null,
  eventClassification: null,
  eventImpact: null,
  dateShape: "date",
  date: new Date(),
  rangeWeeks: 0,
  description: "",
  workstreamDescription: "",
  hasPassed: false,
};

export const eventTypeOptions = Object.values(CoverageType).map((type) => ({
  value: type,
  label: capitalize(type.replace("_", " ")),
}));
