import { z } from "zod";
import { EventEstimateProbability } from "@/api/types";

export const estimateFormSchema = z.object({
  upside_percentage: z.coerce
    .number()
    .min(0, { message: "Upside percentage must be at least 0" })
    .max(1000, { message: "Upside percentage cannot exceed 1000" }),
  implied_upside_price: z.coerce
    .number()
    .min(0, { message: "Price must be positive" })
    .optional(),
  upside_probability: z.nativeEnum(EventEstimateProbability, {
    message: "Upside probability is required",
  }),
  upside_notes: z.string().min(1, { message: "Upside notes are required" }),
  downside_percentage: z.coerce
    .number()
    .min(0, { message: "Downside percentage must be at least 0" })
    .max(100, { message: "Downside percentage cannot exceed 100" }),
  implied_downside_price: z.coerce
    .number()
    .min(0, { message: "Price must be positive" })
    .optional(),
  downside_probability: z.nativeEnum(EventEstimateProbability, {
    message: "Downside probability is required",
  }),
  downside_notes: z.string().min(1, { message: "Downside notes are required" }),
});

export type EstimateFormData = z.infer<typeof estimateFormSchema>;
