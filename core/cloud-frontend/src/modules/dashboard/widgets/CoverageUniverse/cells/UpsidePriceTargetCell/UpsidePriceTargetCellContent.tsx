import { memo, useCallback, useState } from "react";
import { AxiosError } from "axios";
import {
  CompanyResponsePrimaryAnalystUpsidePriceTarget as PriceTarget,
  HTTPError,
} from "@api/types";
import { toast } from "@components/ui/use-toast";
import { PriceTargetDropdown } from "../../components/PriceTargetDropdown";
import { useOptimisticSetUpsidePriceTarget } from "../../hooks/useOptimisticSetUpsidePriceTarget";
import { PriceTargetFormData } from "../../components/PriceTargetForm/priceTargetSchema";
import { useAuth } from "@/modules/auth/providers/AuthProvider";

export interface UpsidePriceTargetCellContentProps {
  companyId: number;
  primaryAnalystId: number | null;
  priceTarget: PriceTarget;
}

export const UpsidePriceTargetCellContent = memo(
  ({
    companyId,
    priceTarget,
    primaryAnalystId,
  }: UpsidePriceTargetCellContentProps) => {
    const { account: user } = useAuth();

    const { mutateAsync: updatePriceTarget, isPending: isSaving } =
      useOptimisticSetUpsidePriceTarget();

    const [open, setOpen] = useState(false);

    const isCurrentUserPrimaryAnalyst = primaryAnalystId === user?.id;

    const saveChanges = useCallback(
      async (data: PriceTargetFormData) => {
        try {
          await updatePriceTarget({
            companyId,
            data: { price_target_usd: +data.priceTarget },
          });
          toast({
            title: "Price target updated successfully",
          });
        } catch (error) {
          const axiosError = error as AxiosError<HTTPError>;
          toast({
            title: "Failed to update price target",
            description: axiosError.response?.data.detail,
            variant: "destructive",
          });
        }
      },
      [companyId, updatePriceTarget]
    );

    const handleSave = useCallback(
      async (data: PriceTargetFormData) => {
        await saveChanges(data);
        setOpen(false);
      },
      [saveChanges]
    );

    return (
      <PriceTargetDropdown
        type="upside"
        testId={`price-target-upside-dropdown-[${companyId}]`}
        disableSave={!isCurrentUserPrimaryAnalyst}
        isSaving={isSaving}
        data={priceTarget}
        open={open}
        onOpenChange={setOpen}
        onSave={handleSave}
      />
    );
  }
);
