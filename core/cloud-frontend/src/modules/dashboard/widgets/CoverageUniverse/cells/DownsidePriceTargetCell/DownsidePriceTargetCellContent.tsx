import { memo, useCallback, useState } from "react";
import { AxiosError } from "axios";
import {
  CompanyResponsePrimaryAnalystDownsidePriceTarget as PriceTarget,
  HTTPError,
} from "@api/types";
import { useAuth } from "@modules/auth/providers/AuthProvider";
import { toast } from "@components/ui/use-toast";
import { PriceTargetDropdown } from "../../components/PriceTargetDropdown";
import { useOptimisticSetDownsidePriceTarget } from "../../hooks/useOptimisticSetDownsidePriceTarget";
import { PriceTargetFormData } from "../../components/PriceTargetForm/priceTargetSchema";

export interface DownsidePriceTargetCellContentProps {
  companyId: number;
  primaryAnalystId: number | null;
  priceTarget: PriceTarget;
}

export const DownsidePriceTargetCellContent = memo(
  ({
    companyId,
    primaryAnalystId,
    priceTarget,
  }: DownsidePriceTargetCellContentProps) => {
    const { account: user } = useAuth();

    const { mutateAsync: updatePriceTarget, isPending: isSaving } =
      useOptimisticSetDownsidePriceTarget();

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
        type="downside"
        testId={`price-target-downside-dropdown-[${companyId}]`}
        disableSave={!isCurrentUserPrimaryAnalyst}
        isSaving={isSaving}
        open={open}
        data={priceTarget}
        onSave={handleSave}
        onOpenChange={setOpen}
      />
    );
  }
);
