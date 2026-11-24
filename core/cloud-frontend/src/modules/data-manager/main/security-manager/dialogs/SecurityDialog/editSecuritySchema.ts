import { z } from "zod";

export const editSecuritySchema = z.object({
  name: z.string().min(1, "Required"),
  asset_class: z.object({
    label: z.string().min(1, "Required"),
    value: z.string().min(1, "Required"),
  }),
});

export type EditSecurityFormData = z.infer<typeof editSecuritySchema>;

export const defaultEditSecurityValues: EditSecurityFormData = {
  name: "",
  asset_class: {
    label: "",
    value: "",
  },
};
