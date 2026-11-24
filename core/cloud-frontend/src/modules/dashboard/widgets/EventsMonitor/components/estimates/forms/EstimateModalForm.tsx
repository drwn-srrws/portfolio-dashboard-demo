import { toast } from "@/components/ui/use-toast";
import {
  useCreateEventEstimate,
  usePatchEventEstimate,
} from "@/api/endpoints/event/event";
import { type EstimateFormData } from "./schemas/estimateFormSchema";
import {
  MarketDataPriceResponse,
  CompanyEventEstimateResponse,
} from "@/api/types";
import { BaseEstimateForm } from "./BaseEstimateForm";
import {
  convertBpsToPricePerShareUpside,
  convertBpsToPricePerShareDownside,
} from "../utils/priceConversionUtils";
import {
  prepareEstimateData,
  showEstimateSuccessToast,
} from "../utils/estimateUtils";
import { useChangeHistory } from "../../../../../providers/ChangeHistoryProvider";

interface EstimateModalFormProps {
  eventId: number;
  onClose: () => void;
  marketData?: MarketDataPriceResponse | null;
  currentUserEstimate?: CompanyEventEstimateResponse;
  isPrimaryAnalyst: boolean;
  companyName: string;
}

export const EstimateModalForm = ({
  eventId,
  onClose,
  marketData,
  currentUserEstimate,
  isPrimaryAnalyst,
  companyName,
}: EstimateModalFormProps) => {
  const { addHistoryEntry } = useChangeHistory();

  const { mutateAsync: createEstimate, isPending: isCreating } =
    useCreateEventEstimate();

  const { mutateAsync: updateEstimate, isPending: isUpdating } =
    usePatchEventEstimate();

  const isEditMode = !!currentUserEstimate;
  const isPending = isCreating || isUpdating;

  const defaultValues: Partial<EstimateFormData> = currentUserEstimate
    ? {
        upside_percentage: currentUserEstimate.upside_percentage,
        implied_upside_price: marketData?.price
          ? convertBpsToPricePerShareUpside(
              currentUserEstimate.upside_percentage,
              marketData.price
            )
          : undefined,
        upside_probability: currentUserEstimate.upside_probability,
        upside_notes: currentUserEstimate.upside_notes || "",
        downside_percentage: currentUserEstimate.downside_percentage,
        implied_downside_price: marketData?.price
          ? convertBpsToPricePerShareDownside(
              currentUserEstimate.downside_percentage,
              marketData.price
            )
          : undefined,
        downside_probability: currentUserEstimate.downside_probability,
        downside_notes: currentUserEstimate.downside_notes || "",
      }
    : {};

  const onSubmit = async (data: EstimateFormData) => {
    try {
      const estimateData = prepareEstimateData(data);

      if (isEditMode) {
        await updateEstimate({
          eventId,
          userId: currentUserEstimate.created_by.id,
          data: estimateData,
        });
        addHistoryEntry({
          type: "update",
          entity: "estimate",
          title: "Estimate Updated",
          description: `${companyName} - Event #${eventId}`,
          data: { eventId, userId: currentUserEstimate.created_by.id },
        });
        showEstimateSuccessToast("Updated", companyName, isPrimaryAnalyst);
      } else {
        await createEstimate({
          eventId,
          data: estimateData,
        });
        addHistoryEntry({
          type: "create",
          entity: "estimate",
          title: "Estimate Created",
          description: `${companyName} - Event #${eventId}`,
          data: { eventId, isPrimaryAnalyst },
        });
        showEstimateSuccessToast("Created", companyName, isPrimaryAnalyst);
      }

      onClose();
    } catch {
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? "update" : "create"} estimate`,
        variant: "destructive",
      });
    }
  };

  return (
    <BaseEstimateForm
      defaultValues={defaultValues}
      marketData={marketData}
      onSubmit={onSubmit}
      onClose={onClose}
      submitButtonText={
        isPending
          ? isEditMode
            ? "Updating..."
            : "Creating..."
          : isEditMode
            ? "Update Estimate"
            : "Create Estimate"
      }
      isLoading={isPending}
    />
  );
};
