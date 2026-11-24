import { z } from "zod";

export const priceTargetSchema = z.object({
  priceTarget: z.coerce.number().min(0),
});

export type PriceTargetFormData = z.infer<typeof priceTargetSchema>;

export const priceTargetDefaultValues: PriceTargetFormData = {
  priceTarget: 0,
};
