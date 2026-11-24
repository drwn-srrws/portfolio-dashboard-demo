import { z } from "zod";

export const editIssuerSchema = z.object({
  company: z
    .object({
      value: z.string().min(1, "Required"),
      label: z.string().min(1, "Required"),
    })
    .nullable(),
});

export type EditIssuerFormData = z.infer<typeof editIssuerSchema>;

export type EditIssuerFormDataType = {
  company: {
    value: string;
    label: string;
  } | null;
};

export const defaultEditIssuerValues: EditIssuerFormDataType = {
  company: null,
};
