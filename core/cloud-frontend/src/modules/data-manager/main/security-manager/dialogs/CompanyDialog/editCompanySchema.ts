import { z } from "zod";

export const instrumentSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const primaryInstrumentSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const countryOfRiskSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const editCompanySchema = z.object({
  instrument_ids: z.array(instrumentSchema),
  primary_instrument_id: primaryInstrumentSchema.nullable().optional(),
  country_of_risk: countryOfRiskSchema.nullable().optional(),
});

export type EditCompanyFormData = z.infer<typeof editCompanySchema>;

export const defaultEditCompanyValues: EditCompanyFormData = {
  instrument_ids: [],
  primary_instrument_id: null,
  country_of_risk: null,
};
