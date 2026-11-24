import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@components/ui";
import { FormTextField } from "@components/Form/FormTextField";
import {
  priceTargetDefaultValues,
  PriceTargetFormData,
  priceTargetSchema,
} from "./priceTargetSchema";
import { PriceTargetType } from "../PriceTargetDropdown";
import { useAuth } from "@/modules/auth/providers/AuthProvider";

const priceTargetDropdownTitle: Record<PriceTargetType, string> = {
  upside: "Upside",
  downside: "Downside",
};

export interface PriceTargetFormProps {
  type: PriceTargetType;
  defaultValues?: PriceTargetFormData;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: PriceTargetFormData) => void;
}

export const PriceTargetForm = ({
  type,
  defaultValues,
  isSaving,
  onClose,
  onSave,
}: PriceTargetFormProps) => {
  const { account } = useAuth();
  const { control, handleSubmit } = useForm<PriceTargetFormData>({
    defaultValues: defaultValues ?? priceTargetDefaultValues,
    resolver: zodResolver(priceTargetSchema),
  });
  return (
    <form onSubmit={handleSubmit(onSave)}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-sm">
            Set {priceTargetDropdownTitle[type]} Price Target
          </div>
          <div className="text-xs text-neutral-400">
            By {account?.first_name} {account?.last_name}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">
            {priceTargetDropdownTitle[type]} Price Target*
          </div>
          <FormTextField
            data-testid={`price-target-input`}
            type="number"
            name="priceTarget"
            control={control}
            placeholder="Enter price target"
          />
        </div>

        <div className="flex justify-between gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button
            type="submit"
            data-testid={`price-target-save-button`}
            className="bg-neutral-600 text-foreground hover:bg-neutral-600/80"
            disabled={isSaving}
          >
            {isSaving ? "Updating..." : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
};
