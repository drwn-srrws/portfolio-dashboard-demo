import { memo, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import { useStore } from "@/store";
import { Dialogs } from "@/store/slices/dialogsSlice";

import { EstimateModalPrefilledData } from "../../../../../types/EstimateModalTypes";
import { EstimateTooltip } from "../../../../../components/estimates/components/EstimateTooltip";
import { EstimateType } from "../../../../../types/EstimateTypes";
import { StaleEstimate } from "../../../types/StaleEstimatesData";

export interface NoteCellContentProps {
  type: "upside" | "downside";
  estimateData?: StaleEstimate;
}

export const NoteCellContent = memo(
  ({ type, estimateData }: NoteCellContentProps) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const { updateDialog } = useStore();

    const handleTooltipOpenChange = useCallback((open: boolean) => {
      setTooltipOpen(open);
    }, []);

    const handleClick = useCallback(() => {
      if (!estimateData) return;

      const prefilledData: EstimateModalPrefilledData = {
        eventId: estimateData.eventId,
        companyId: estimateData.companyId,
        companyName: estimateData.companyName,
        estimates: estimateData.estimates,
        primaryAnalyst: estimateData.primaryAnalyst,
      };

      updateDialog({
        dialog: Dialogs.createEstimateDialog,
        status: true,
        prefilled: prefilledData,
      });

      setTooltipOpen(false);
    }, [estimateData, updateDialog]);

    const value =
      type === "upside" ? estimateData?.upsideNote : estimateData?.downsideNote;

    if (!estimateData) return <span className="text-neutral-400">—</span>;

    const tooltipType: EstimateType =
      type === "upside" ? "implied_upside" : "implied_downside";

    return (
      <Tooltip open={tooltipOpen} onOpenChange={handleTooltipOpenChange}>
        <TooltipTrigger asChild>
          <div className="flex items-center h-full px-2 cursor-pointer">
            <Button
              variant="ghost"
              className="flex w-full h-full justify-start p-0 hover:bg-transparent text-white"
              onClick={handleClick}
            >
              <span className="truncate underline">{value || "—"}</span>
            </Button>
          </div>
        </TooltipTrigger>

        {estimateData.estimates?.length > 0 &&
          createPortal(
            <TooltipContent
              side="right"
              className="z-50 backdrop-blur-md shadow-2xl rounded-xl bg-neutral-800 max-w-[320px] text-white"
            >
              <EstimateTooltip
                type={tooltipType}
                estimates={estimateData.estimates}
              />
            </TooltipContent>,
            document.body
          )}
      </Tooltip>
    );
  }
);
