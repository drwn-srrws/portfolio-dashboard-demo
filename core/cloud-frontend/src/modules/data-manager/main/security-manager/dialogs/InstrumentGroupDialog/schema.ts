import { z } from "zod";

export const instrumentSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const createSecurityCompanySchema = z.object({
  companyName: z.string().min(1, "Required"),
  addSecurities: z
    .array(instrumentSchema)
    .min(1, "Select at least one security"),
});

export type CreateSecurityCompanyFormData = z.infer<
  typeof createSecurityCompanySchema
>;

export const defaultCreateSecurityCompanyValues: CreateSecurityCompanyFormData =
  {
    companyName: "",
    addSecurities: [],
  };
