import { toast } from "@/components/ui/use-toast";
import { type EstimateFormData } from "../forms/schemas/estimateFormSchema";

export const prepareEstimateData = (data: EstimateFormData) => ({
  upside_percentage: data.upside_percentage,
  upside_probability: data.upside_probability,
  upside_notes: data.upside_notes,
  downside_percentage: data.downside_percentage,
  downside_probability: data.downside_probability,
  downside_notes: data.downside_notes,
});

export const showEstimateSuccessToast = (
  action: "Updated" | "Created",
  companyName: string,
  isPrimaryAnalyst: boolean
) => {
  const actionText = action.toLowerCase();
  const baseDescription = `Your estimate for ${companyName} has been ${actionText}`;

  toast({
    title: `Estimate ${action}`,
    description: isPrimaryAnalyst
      ? `${baseDescription} successfully.`
      : `${baseDescription}, but it won't be displayed on the dashboard since you're not the primary analyst for this company.`,
  });
};
