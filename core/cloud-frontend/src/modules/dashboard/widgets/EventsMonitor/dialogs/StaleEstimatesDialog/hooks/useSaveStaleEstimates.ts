import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { patchEventEstimate } from "@/api/endpoints/event/event";
import { StaleEstimate } from "../types/StaleEstimatesData";
import { useChangeHistory } from "../../../../../providers/ChangeHistoryProvider";

export const useSaveStaleEstimates = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { addHistoryEntry } = useChangeHistory();

  const saveEstimates = async (
    localEstimates: StaleEstimate[],
    originalEstimates: StaleEstimate[],
    onSuccess?: () => void
  ) => {
    const changedEstimates = localEstimates.filter((local) =>
      originalEstimates.some(
        (orig) =>
          orig.id === local.id &&
          (orig.reaffirm !== local.reaffirm ||
            orig.upsideEstimate !== local.upsideEstimate ||
            orig.downsideEstimate !== local.downsideEstimate ||
            orig.upsideNote !== local.upsideNote ||
            orig.downsideNote !== local.downsideNote)
      )
    );

    if (!changedEstimates.length) {
      onSuccess?.();
      return;
    }

    setIsSaving(true);

    try {
      await Promise.all(
        changedEstimates.map(async (estimate) => {
          if (!estimate.reaffirm) {
            return Promise.resolve();
          }

          if (!estimate.userId) {
            throw new Error(`User ID is missing for estimate ${estimate.id}`);
          }

          return patchEventEstimate(estimate.eventId, estimate.userId, {
            upside_percentage: estimate.upsidePercentage,
            downside_percentage: estimate.downsidePercentage,
            upside_notes: estimate.upsideNote,
            downside_notes: estimate.downsideNote,
            upside_probability: estimate.upsideProbability,
            downside_probability: estimate.downsideProbability,
          });
        })
      );

      toast({ title: "Estimates were saved!" });

      changedEstimates
        .filter((estimate) => estimate.reaffirm)
        .forEach((estimate) => {
          addHistoryEntry({
            type: "update",
            entity: "batch_estimates",
            title: "Stale Estimate Updated",
            description: `${estimate.companyName} - Event #${estimate.eventId}`,
            data: { estimateId: estimate.id },
          });
        });

      onSuccess?.();
    } catch (e: unknown) {
      toast({ title: (e as Error).message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return { saveEstimates, isSaving };
};
