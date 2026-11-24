import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui";
import { FormTextField } from "@/components/Form/FormTextField";
import { FormTextSelect } from "@/components/Form/FormTextSelect";
import { FormTextArea } from "@/components/Form/FormTextArea";
import {
  estimateFormSchema,
  type EstimateFormData,
} from "./schemas/estimateFormSchema";
import {
  estimateProbabilityOptions,
  getDownsideByUpside,
} from "../utils/probabilityUtils";
import {
  convertBpsToPricePerShareUpside,
  convertBpsToPricePerShareDownside,
} from "../utils/priceConversionUtils";
import { MarketDataPriceResponse } from "@/api/types";

interface BaseEstimateFormProps {
  defaultValues: Partial<EstimateFormData>;
  marketData?: MarketDataPriceResponse | null;
  onSubmit: (data: EstimateFormData) => Promise<void>;
  onClose: () => void;
  submitButtonText: string;
  isLoading: boolean;
  isReadOnly?: boolean;
}

export const BaseEstimateForm = ({
  defaultValues,
  marketData,
  onSubmit,
  onClose,
  submitButtonText,
  isLoading,
  isReadOnly = false,
}: BaseEstimateFormProps) => {
  const form = useForm<EstimateFormData>({
    resolver: zodResolver(estimateFormSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const {
    handleSubmit,
    formState: { isDirty },
    watch,
  } = form;

  watch((data, { name }) => {
    if (name === "upside_probability" && data.upside_probability) {
      const downsideProbability = getDownsideByUpside(data.upside_probability);
      if (downsideProbability) {
        form.setValue("downside_probability", downsideProbability);
      }
    }

    if (
      name === "upside_percentage" &&
      data.upside_percentage !== undefined &&
      marketData?.price
    ) {
      const impliedPrice = convertBpsToPricePerShareUpside(
        data.upside_percentage,
        marketData.price
      );
      form.setValue("implied_upside_price", impliedPrice);
    }

    if (
      name === "downside_percentage" &&
      data.downside_percentage !== undefined &&
      marketData?.price
    ) {
      const impliedPrice = convertBpsToPricePerShareDownside(
        data.downside_percentage,
        marketData.price
      );
      form.setValue("implied_downside_price", impliedPrice);
    }
  });

  return (
    <div className="space-y-4">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormTextField<EstimateFormData>
              name="upside_percentage"
              label="Upside %"
              type="number"
              min={0}
              max={1000}
              required
              disabled={isReadOnly}
            />
            <FormTextField<EstimateFormData>
              name="implied_upside_price"
              label="Implied Upside ($/shr)"
              type="number"
              min={Math.floor(marketData?.price || 0)}
              step="0.01"
              disabled
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormTextField<EstimateFormData>
              name="downside_percentage"
              label="Downside %"
              type="number"
              min={0}
              max={100}
              required
              disabled={isReadOnly}
            />
            <FormTextField<EstimateFormData>
              name="implied_downside_price"
              label="Implied Downside ($/shr)"
              type="number"
              min={0}
              max={marketData?.price}
              step="0.01"
              disabled
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormTextSelect<EstimateFormData>
              name="upside_probability"
              label="Upside POS"
              options={estimateProbabilityOptions}
              required
              disabled={isReadOnly}
            />
            <FormTextSelect<EstimateFormData>
              name="downside_probability"
              label="Downside POS"
              options={estimateProbabilityOptions}
              disabled={true}
            />
          </div>

          <div className="space-y-4">
            <FormTextArea<EstimateFormData>
              name="upside_notes"
              label="Upside Notes"
              rows={3}
              required
              disabled={isReadOnly}
            />
            <FormTextArea<EstimateFormData>
              name="downside_notes"
              label="Downside Notes"
              rows={3}
              required
              disabled={isReadOnly}
            />
          </div>

          {!isReadOnly && (
            <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end sm:gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="text-neutral-300 hover:text-white hover:bg-neutral-700 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={!isDirty || isLoading}
                className="w-full sm:w-auto"
              >
                {submitButtonText}
              </Button>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  );
};
