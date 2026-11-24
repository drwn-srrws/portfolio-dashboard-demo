import { z } from "zod";

export const eventSchema = z
  .object({
    name: z.string().min(1, "Required"),
    type: z.string().min(1, "Required"),
    classification: z.string().min(1, "Required"),
    company: z.string().min(1, "Required"),
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
    impact: z.string().nullable(),
    description: z.string().optional(),
    workstreamDescription: z.string().optional(),
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

export type EventFormData = z.infer<typeof eventSchema>;

export const defaultEventValues: EventFormData = {
  name: "",
  type: "",
  classification: "",
  company: "",
  dateShape: "date",
  date: null as unknown as Date,
  rangeWeeks: 0,
  impact: "",
  description: "",
  workstreamDescription: "",
};
